import 'express-async-errors';

import { Help } from '../../models/helpAndTables.model';
import { Job } from '../../models/jobs.model';
import { Order } from '../../models/order.model';
import { User } from '../../models/stuff.model';
import { UpdateIsPaidHandler } from '../../types/endpoints/order.endpoint';
import { SocketChannels } from '../../types/socketChannels';
import { SystemRole } from '../../types/systemRole';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const updateIsPaidHandler: UpdateIsPaidHandler = async (req, res, next) => {
  const io = req.app.get('socketio');
  const users: string[] = [];

  const cashiers = await User.find({
    typeId: SystemRole.cashier,
    _id: { $ne: req.loggedUser?.id },
    online: true,
  });

  let updatedOrder = await Order.findByIdAndUpdate(
    req.params.orderId,
    { isPaid: true, paidAt: Date.now(), stuff: req.loggedUser?.id },
    { new: true },
  )
    .populate({
      path: 'cartItems.product cartItems.extra',
      populate: { path: 'extra' },
    })
    .populate([{ path: 'user', select: 'name' }]);

  if (!updatedOrder) return next(new NotFoundError('Order not found'));

  const currentOrders = await Order.find({
    customer: updatedOrder.customer,
    tableNum: updatedOrder.tableNum,
    isPaid: false,
  });

  updatedOrder = await (
    await updatedOrder.populate({
      path: 'cartItems.product cartItems.extra',
      populate: { path: 'extra' },
    })
  ).populate([{ path: 'user', select: 'name' }]);

  if (currentOrders.length === 0 && !updatedOrder.TakeAway) {
    const help = await Help.findOneAndUpdate(
      {
        tableNum: updatedOrder.tableNum,
        tableStatus: 'busy',
      },
      { cleanStatus: true },
      { new: true },
    );

    const cleanerUser = await User.findOneAndUpdate(
      { typeId: SystemRole.cleaner, online: true },
      { $inc: { orders: 1 } },
      { sort: { orders: 1 }, new: true },
    );

    if (cleanerUser) users.push(cleanerUser.id);

    const ifCleaner = await User.findOne({typeId:SystemRole.cleaner});

    if (cleanerUser && ifCleaner) {
      help!.user = cleanerUser.id;
      await help?.save();
      updatedOrder = await Order.findByIdAndUpdate(
        req.params.orderId,
        { user: cleanerUser.id },
        { new: true },
      )
        .populate({
          path: 'cartItems.product cartItems.extra',
          populate: { path: 'extra' },
        })
        .populate([{ path: 'user', select: 'name' }]);

      const user = await Job.findOne({ user: cleanerUser.id });
      if (!user)
        await Job.create({
          user: cleanerUser.id,
          type: SystemRole.cleaner,
          orders: [updatedOrder?.id],
        });
      else
        await Job.findOneAndUpdate(
          { user: cleanerUser.id },
          { $push: { orders: updatedOrder?.id } },
        );
    } else if(ifCleaner) {
      const job = await Job.findOne({ type: SystemRole.cleaner, user: { $exists: false } });
      if (job) {
        if (!job.orders.find((order) => order.toString() === updatedOrder?.id)) {
          job.orders.push(updatedOrder.id);
          await job.save();
        }
      } else {
        await Job.create({ type: SystemRole.cleaner, orders: [updatedOrder.id] });
      }
    }

    users.forEach((userId) => {
      const userSocket = io.sockets.sockets.get(userId);
      if (userSocket) {
        userSocket.join(userId);
        io.to(userId).emit(SocketChannels.isPaidUpdated, updatedOrder);
      }
    });
  }

  if (cashiers.length > 0) {
    cashiers.forEach((obj) => {
      const userSocket = io.sockets.sockets.get(obj?.id);
      if (userSocket) {
        userSocket.join(obj?.id);
        io.to(obj?.id).emit(SocketChannels.orderUpdated, updatedOrder);
      }
    });
  }

  res.status(200).json({ message: 'success', data: updatedOrder! });
};
