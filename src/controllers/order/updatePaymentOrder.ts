import 'express-async-errors';
import { Help } from '../../models/helpAndTables.model';
import { Job } from '../../models/jobs.model';
import { Order } from '../../models/order.model';
import { User } from '../../models/stuff.model';
import { UpdateOrderPaymentHandler } from '../../types/endpoints/order.endpoint';
import { SocketChannels } from '../../types/socketChannels';
import { SystemRole } from '../../types/systemRole'; // Corrected the typo
import { NotFoundError } from '../../utils/errors/notfound-error';

export const updateOrderPaymentHandler: UpdateOrderPaymentHandler = async (req, res, next) => {
  const orderId = req.params.OrderId;
  let order = await Order.findById(orderId);
  if (!order) return next(new NotFoundError('Order not found'));

  const cleanerUser = await User.findOneAndUpdate(
    { typeId: SystemRole.cleaner, online: true },
    { $inc: { orders: 1 } },
    { sort: { orders: 1 }, new: true },
  );
  const cashierUsers = await User.find({ typeId: SystemRole.cashier, online: true });

  const users = [cleanerUser?.id, ...cashierUsers.map((user) => user.id)].filter(Boolean);

  order.paymentMethodType = req.body.payment;
  order.operationNumber = req.body.operationNumber;
  order.isPaid = true;
  order.paidAt = new Date(Date.now());
  await order.save();

  let help = await Help.findOne({ tableNum: order.tableNum, cleanStatus: true });
  const ifCleaner = await User.findOne({typeId:SystemRole.cleaner});
  if (!help && ifCleaner) {
    help = await Help.findOneAndUpdate(
      { tableNum: order.tableNum },
      { cleanStatus: true },
      { new: true },
    );
    const io = req.app.get('socketio');

    if (cleanerUser) {
      help!.user = cleanerUser.id;
      await help?.save();
      order.user = cleanerUser.id;
      let userJob = await Job.findOne({ user: cleanerUser.id });
      if (!userJob) {
        userJob = await Job.create({
          user: cleanerUser.id,
          type: SystemRole.cleaner,
          orders: [order.id],
        });
      } else if (ifCleaner) {
        await Job.findOneAndUpdate({ user: cleanerUser.id }, { $push: { orders: order.id } });
      }
    }
    
    order = await Order.findById(orderId)
      .populate([{ path: 'user', select: 'name' }])
      .populate({
        path: 'cartItems.product cartItems.extra',
        populate: { path: 'extra' },
      });
    users.forEach((userId) => {
      const userSocket = io.sockets.sockets.get(userId);
      if (userSocket) {
        userSocket.join(userId);
        io.to(userId).emit(SocketChannels.isPaidUpdated, order);
      }
    });
  }
  res.status(200).json({ message: 'success' });
};
