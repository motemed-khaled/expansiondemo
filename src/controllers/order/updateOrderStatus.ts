/* eslint-disable no-constant-condition */
import 'express-async-errors';
import { Job } from '../../models/jobs.model';
import { Order } from '../../models/order.model';
import { Resturant } from '../../models/resturant.model';
import { User } from '../../models/stuff.model';
import { UpdateOrderStatusHandler } from '../../types/endpoints/order.endpoint';
import { SocketChannels } from '../../types/socketChannels';
import { SystemRole } from '../../types/systemRole';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { NotFoundError } from '../../utils/errors/notfound-error';
import { scheduleWaiter } from '../../utils/queue/scheduleNotification';

export const updateOrderStatusHandler: UpdateOrderStatusHandler = async (req, res, next) => {
  const resturant = await Resturant.findOne();
  if (!resturant) return next(new NotFoundError('Restaurant not found'));

  const orderId = req.params.orderId;
  const order = await Order.findById(orderId);
  if (!order) return next(new NotFoundError('Order not found'));

  const waiter = await User.findOne({ typeId: SystemRole.waiter, online: true });
  const ifWaiter = await User.findOne({typeId:SystemRole.waiter});

  const orderStatus = req.body.orderStatus;
  let currentOrderStatus = Number(order.orderStatus);
  let newOrderStatus = Number(orderStatus);

  if (newOrderStatus.toString() === '3' && !waiter) {
    if (ifWaiter) 
      return next(new BadRequestError('No waiter available'));
    else{
      newOrderStatus = 4;
      currentOrderStatus = 3;
      const chiefJob = await Job.findOneAndUpdate(
        { type: SystemRole.chief, orders: order.id },
        { $pull: { orders: order.id } },
      );
  
      await User.findOneAndUpdate(
        { _id: chiefJob?.user, orders: { $gte: 1 } },
        { $inc: { orders: -1 } },
        { new: true }
      );
    }
  }

  if (currentOrderStatus !== newOrderStatus - 1)
    return next(new BadRequestError('Invalid order status transition'));

  order.orderStatus = newOrderStatus.toString();
  order.statusAt.push({ orderStatus, createdAt: new Date() });
  const updatedOrder = await order.save();
  let populatedOrder = await Order.findById(orderId)
    .populate({ path: 'cartItems.product cartItems.extra', populate: { path: 'extra' } })
    .populate({ path: 'user', select: 'name' });

  const users: string[] = [];


  if (newOrderStatus.toString() === '3' && ifWaiter) {
    const waiter = await User.findOneAndUpdate(
      { typeId: SystemRole.waiter, online: true },
      { $inc: { orders: 1 } },
      { sort: { orders: 1 }, new: true },
    );

    if (!waiter) return next(new BadRequestError('No waiter available'));
    users.push(waiter.id);

    populatedOrder = await Order.findByIdAndUpdate(orderId, { user: waiter.id }, { new: true })
      .populate({ path: 'cartItems.product cartItems.extra', populate: { path: 'extra' } })
      .populate({ path: 'user', select: 'name' });

    const delay = resturant.waiterAlert * 60 * 1000 || 3 * 60 * 1000;
    await scheduleWaiter.add({ orderId: order.id, userId: waiter.id }, { delay });

    const chiefJob = await Job.findOneAndUpdate(
      { type: SystemRole.chief, orders: updatedOrder.id },
      { $pull: { orders: updatedOrder.id } },
    );

    await User.findOneAndUpdate(
      { _id: chiefJob?.user, orders: { $gte: 1 } },
      { $inc: { orders: -1 } },
      { new: true }
    );
    
    const job = await Job.findOne({ user: waiter.id });
    if (!job) {
      await Job.create({ user: waiter.id, orders: [updatedOrder.id], type: SystemRole.waiter });
    } else {
      await Job.findOneAndUpdate(
        { user: waiter.id },
        {
          $push: { orders: updatedOrder.id },
        },
      );
    }
  } 
  
  const cashiers = await User.find({ typeId: SystemRole.cashier, online: true });
  cashiers.forEach((cashier) => users.push(cashier.id));
  

  if (newOrderStatus.toString() === '4') {
    populatedOrder = await Order.findByIdAndUpdate(orderId, { user: null }, { new: true }).populate(
      { path: 'cartItems.product cartItems.extra', populate: { path: 'extra' } },
    );
    const waiterJob = await Job.findOneAndUpdate(
      { type: SystemRole.waiter, orders: updatedOrder.id },
      { $pull: { orders: updatedOrder.id } },
    );
    await User.findOneAndUpdate(
      { _id: waiterJob?.user, orders: { $gte: 1 } },
      { $inc: { orders: -1 } },
      { new: true }
    );
  }

  const io = req.app.get('socketio');
  console.log(users);

  users.forEach((userId) => {
    const userSocket = io.sockets.sockets.get(userId);
    if (userSocket) {
      console.log(userSocket);
      
      userSocket.join(userId);
      io.to(userId).emit(SocketChannels.orderUpdated, populatedOrder);
    }
  });

  if (populatedOrder?.customer) {
    const customerSocket = io.sockets.sockets.get(populatedOrder!.customer.toString());
    if (customerSocket) {
      customerSocket.join(populatedOrder!.customer);
      io.to(populatedOrder!.customer).emit(SocketChannels.orderUpdated, populatedOrder);
    }
  }

  res.status(200).json({ message: 'success', data: populatedOrder! });
};
