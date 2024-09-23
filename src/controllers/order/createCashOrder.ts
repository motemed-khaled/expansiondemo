/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import 'express-async-errors';
import mongoose from 'mongoose';

import { Order } from './../../models/order.model';
import { Cart } from '../../models/cart.model';
import { Help } from '../../models/helpAndTables.model';
import { Job } from '../../models/jobs.model';
import { Resturant } from '../../models/resturant.model';
import { User } from '../../models/stuff.model';
import { CreateCashOrderHandler } from '../../types/endpoints/order.endpoint';
import { SocketChannels } from '../../types/socketChannels';
import { SystemRole } from '../../types/systemRole';
import { calcStore } from '../../utils/calcStore';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { NotFoundError } from '../../utils/errors/notfound-error';
import { ServerError } from '../../utils/errors/server-error';
import { UnauthorizedError } from '../../utils/errors/un-authorizedError';
import { scheduleCheif } from '../../utils/queue/scheduleNotification';

export const createCashOrderHandler: CreateCashOrderHandler = async (req, res, next) => {
  const cart = await Cart.findById(req.body.cartId);
  const resturant = await Resturant.find();
  const users: string[] = [];
  const tables = await Help.findOne({
    tableNum: req.body.tableNum.toString(),
  });

  const user1 = await User.find({
    typeId: SystemRole.cashier,
  });
  if (user1.length > 0) user1.forEach((user) => users.push(user.id));

  const currentChief = await User.findOne({
    typeId: SystemRole.chief,
    online: true,
  });
  if (!currentChief) return next(new BadRequestError('sorry not chief available for now'));
  const chief = await User.findOneAndUpdate(
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
  if (!chief) return next(new BadRequestError('sorry not chief available for now'));
  users.push(chief.id);

  if (!tables) return next(new NotFoundError('table not found '));
  if (tables.tableStatus == 'busy' && tables.customerId?.toString() != req.loggedUser?.id)
    return next(new BadRequestError('table not ready for order'));
  tables.customerId = new mongoose.Types.ObjectId(req.loggedUser!.id);
  await tables.save();
  if (!cart) return next(new NotFoundError(`no cart in this id : ${req.body.cartId}`));
  if (cart.customer.toString() !== req.loggedUser?.id)
    return next(new UnauthorizedError('user not owner for this cart'));

  const calcStoreSuccess = await calcStore(cart.cartItems, next);
  if (!calcStoreSuccess) return;
  
  const order = await Order.create({
    customer: req.loggedUser.id,
    cartItems: cart.cartItems,
    totalOrderPrice: cart.totalPrice + (resturant[0].shippingPrice / 100) * cart.totalPrice,
    tableNum: req.body.tableNum,
    description: req.body.description,
    shippingPrice: resturant[0].shippingPrice,
    statusAt: [{ orderStatus: '1', createdAt: new Date() }],
    isWatchied: chief ? true : false,
    user: chief.id,
  });

  if (!order) return next(new ServerError());

  tables.tableStatus = 'busy';
  await tables.save();
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

  await Cart.findByIdAndDelete(req.body.cartId);

  const io = req.app.get('socketio');

  users.forEach((userId) => {
    const userSocket = io.sockets.sockets.get(userId);
    if (userSocket) {
      userSocket.join(userId);
      io.to(userId).emit(SocketChannels.orederCreated, order);
    }
  });

  //append job to user
  const user = await Job.findOne({ user: chief.id });
  if (!user) {
    await Job.create({ user: chief.id, orders: [order.id], type: SystemRole.chief });
  } else {
    await Job.findOneAndUpdate(
      { user: chief.id },
      {
        $push: { orders: order.id },
      },
    );
  }
  const delay = resturant[0].cheifAlert * 60 * 1000 || 15 * 60 * 1000;
  await scheduleCheif.add(
    {
      orderId: order.id,
      userId: chief.id,
    },
    {
      delay,
    },
  );

  res.status(201).json({ message: 'success', data: order });
};
