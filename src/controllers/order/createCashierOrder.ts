/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import 'express-async-errors';

import mongoose from 'mongoose';

import { Help } from '../../models/helpAndTables.model';
import { Job } from '../../models/jobs.model';
import { Order } from '../../models/order.model';
import { Product } from '../../models/product.model';
import { Resturant } from '../../models/resturant.model';
import { User } from '../../models/stuff.model';
import { CreateCashierOrderHandler } from '../../types/endpoints/order.endpoint';
import { SocketChannels } from '../../types/socketChannels';
import { SystemRole } from '../../types/systemRole';
import { calcStore } from '../../utils/calcStore';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { NotFoundError } from '../../utils/errors/notfound-error';
import { scheduleCheif } from '../../utils/queue/scheduleNotification';

export const createCashierOrderHandler: CreateCashierOrderHandler = async (req, res, next) => {
  const products = req.body.list;
  const { tableNum, TakeAway, description } = req.body;
  const resturant = await Resturant.find();
  
  let lastOrder;
  if (resturant.length === 0) return next(new NotFoundError('resturant not found'));

  if (TakeAway) {
    const currentCheif = await User.findOne({
      typeId: SystemRole.chief,
      online: true,
    });

    if (!currentCheif) return next(new BadRequestError('sorry not chief available for now'));
  }

  if (tableNum) {
    const table = await Help.findOne({ tableNum: tableNum });
    if (!table) return next(new NotFoundError('table not found'));
    lastOrder = await Order.findOne({ tableNum: tableNum }).sort({ createdAt: -1 }).limit(1).exec();
    if (!lastOrder)
      return next(new NotFoundError(`this table not have any order in this time : ${tableNum}`));
  }

  const cartItems: any = [];
  for (let i = 0; i < products.length; i++) {
    const product = await Product.findById(products[i].productId);
    if (!product) return next(new NotFoundError(`product not found ${products[i].productId}`));
    let extraPrice = Number(product.price);
    if (products[i].extra && products[i].extra?.length! > 0) {
      for (const product of products[i].extra!) {
        const foundProduct = await Product.findById(product);

        if (!foundProduct) 
          return next(new NotFoundError(`Products not found: ${product}`));
        
        extraPrice += Number(foundProduct?.price);
      }
    }
    cartItems.push({
      product: new mongoose.Types.ObjectId(products[i].productId),
      price: +extraPrice,
      quantity: products[i].quantity,
      extra: products[i].extra || [],
    });

    let totalPrice = 0;
    cartItems.forEach((ele: any) => (totalPrice += ele.quantity * ele.price));
    const calcStoreSuccess = await calcStore(cartItems, next);
    if (!calcStoreSuccess) return;

    const order = await Order.create({
      customer: tableNum ? lastOrder?.customer : null,
      cartItems: cartItems,
      totalOrderPrice: totalPrice * (resturant[0].shippingPrice / 100) + totalPrice,
      tableNum: tableNum ? tableNum : null,
      shippingPrice: resturant[0].shippingPrice,
      statusAt: [{ orderStatus: TakeAway ? '1' : '4', createdAt: new Date() }],
      TakeAway: TakeAway ? true : false,
      description: description ? description : null,
      orderStatus: TakeAway ? '1' : '4',
    });

    if (TakeAway) {
      const cheif = await User.findOneAndUpdate(
        {
          typeId: SystemRole.chief,
          online: true,
        },
        {
          $inc: { orders: 1 },
        },
        {
          sort: { orders: 1 },
          new: true,
        },
      );

      if (!cheif) return next(new BadRequestError('sorry not chef available for now'));
      order.user = cheif.id;
      await order.save();
      await (
        await order.populate({
          path: 'cartItems.product cartItems.extra',
          populate: {
            path: 'extra',
          },
        })
      ).populate({
        path: 'user',
        select: 'name',
      });

      const io = req.app.get('socketio');
      const userSocket = io.sockets.sockets.get(cheif.id);
      console.log(userSocket);
      if (userSocket) {
        console.log(true);
        userSocket.join(cheif.id);
        io.to(cheif.id).emit(SocketChannels.orederCreated, order);
      }
      
      //append job to user
      const user = await Job.findOne({ user: cheif.id });
      if (!user) {
        await Job.create({ user: cheif.id, orders: [order.id], type: SystemRole.chief });
      } else {
        await Job.findOneAndUpdate(
          { user: cheif.id },
          {
            $push: { orders: order.id },
          },
        );
      }
      const delay = resturant[0].cheifAlert * 60 * 1000 || 15 * 60 * 1000;
      await scheduleCheif.add(
        {
          orderId: order.id,
          userId: cheif.id,
        },
        {
          delay,
        },
      );
    }

    const newOrder = await (
      await order.save()
    ).populate({
      path: 'cartItems.product cartItems.extra',
      populate: {
        path: 'extra',
      },
    });
    res.status(200).json({ message: 'success', data: newOrder });
  }
};
