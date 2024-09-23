import 'express-async-errors';

import { Help } from '../../models/helpAndTables.model';
import { Job } from '../../models/jobs.model';
import { Order } from '../../models/order.model';
import { User } from '../../models/stuff.model';
import { UpdateAllUserOrderPaymentHandler } from '../../types/endpoints/order.endpoint';
import { SocketChannels } from '../../types/socketChannels';
import { SystemRole } from '../../types/systemRole';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const updateAllUserOrderPaymentHandler: UpdateAllUserOrderPaymentHandler = async (
  req,
  res,
  next,
) => {
  const users: string[] = [];

  const cashierUsers = await User.find({ typeId: SystemRole.cashier, online: true });
  cashierUsers.forEach((user) => users.push(user.id));

  const orders = await Order.find({ customer: req.loggedUser?.id, isPaid: false });
  if (orders.length === 0) return next(new NotFoundError('User does not have unpaid orders'));

  const currentTime = new Date();
  await Promise.all(
    orders.map(async (order) => {
      order.isPaid = true;
      order.paidAt = currentTime;
      order.paymentMethodType = req.body.payment;
      order.operationNumber = req.body.operationNumber;
      await order.save();
    }),
  );

  const help = await Help.findOne({ tableNum: orders[0].tableNum, cleanStatus: true });
  const io = req.app.get('socketio');

  const ifCleaner = await User.findOne({typeId:SystemRole.cleaner});

  if (!help && ifCleaner) {
    const help = await Help.findOneAndUpdate(
      { tableNum: orders[0].tableNum },
      { cleanStatus: true, tableStatus: 'busy' },
    );
    const cleanerUser = await User.findOneAndUpdate(
      { typeId: SystemRole.cleaner, online: true },
      { $inc: { orders: 1 } },
      { sort: { orders: 1 }, new: true },
    );

    if (cleanerUser) {
      help!.user = cleanerUser.id;
      await help?.save();
      await Order.findOneAndUpdate({ _id: orders[0].id }, { user: cleanerUser.id });
      const userSocket = io.sockets.sockets.get(cleanerUser.id);
      if (userSocket) {
        userSocket.join(cleanerUser.id);
        io.to(cleanerUser.id).emit(SocketChannels.isPaidUpdated, orders[0]);
      }
      const user = await Job.findOne({ user: cleanerUser.id });
      if (!user)
        await Job.create({
          user: cleanerUser.id,
          type: SystemRole.cleaner,
          orders: [orders[0].id],
        });
      else
        await Job.findOneAndUpdate({ user: cleanerUser.id }, { $push: { orders: orders[0].id } });
    } else if(ifCleaner) {
      await Job.create({ type: SystemRole.cleaner, orders: [orders[0].id] });
    }
  }
  users.forEach((userId) => {
    const userSocket = io.sockets.sockets.get(userId);
    if (userSocket) {
      userSocket.join(userId);
      orders.forEach((order) => {
        io.to(userId).emit(SocketChannels.isPaidUpdated, order);
      });
    }
  });

  res.status(200).json({ message: 'success' });
};
