import 'express-async-errors';

import { Job } from '../../models/jobs.model';
import { Order } from '../../models/order.model';
import { User } from '../../models/stuff.model';
import { UserLoggedOutHandler } from '../../types/endpoints/stuff.endpoint';
import { SocketChannels } from '../../types/socketChannels';
import { SystemRole } from '../../types/systemRole';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const userLoggedOutHandler: UserLoggedOutHandler = async (req, res, next) => {
  const cashier = await User.find({ typeId: SystemRole.cashier, online: true });
  const user = await User.findById(req.params.userId);
  if (!user) return next(new NotFoundError(`user not found ${req.params.userId}`));
  const jobs = await Job.findOne({ user: user.id }).populate({
    path: 'orders',
    populate: {
      path: 'cartItems.product cartItems.extra',
      populate: {
        path: 'extra',
      },
    },
  });

  if (!jobs || jobs?.orders.length === 0) {
    user.token = undefined;
    user.online = false;
    await user.save();
    return res.status(200).json({ message: 'success' });
  }

  const users = await User.find({
    typeId: user.typeId,
    online: true,
    _id: { $ne: req.params.userId },
  });

  if (users.length === 0)
    return next(new BadRequestError('user have jobs and not found any one to complete it'));

  const io = req.app.get('socketio');
  const userCount = users.length;
  const jobCount = jobs.orders.length;

  let userIndex = 0;
  for (let i = 0; i < jobCount; i++) {
    if (userIndex === userCount) {
      if (jobCount < userCount) {
        break;
      }
      userIndex = 0;
    }

    const job = jobs.orders[i];
    let newJob: any;

    const user = users[userIndex];
    const userSocket = io.sockets.sockets.get(user.id);
    if (userSocket) {
      const userJob = await Job.findOne({ user: user.id });

      if (!userJob) {
        await Job.create({ user: user.id, orders: [job.id], type: jobs.type });
      } else {
        await Job.findOneAndUpdate(
          { user: user.id },
          {
            $push: { orders: job.id },
          },
        );
      }
      newJob = await Order.findByIdAndUpdate(job.id, { user: user.id }, { new: true })
        .populate({
          path: 'cartItems.product cartItems.extra',
          populate: {
            path: 'extra',
          },
        })
        .populate([{ path: 'customer' }, { path: 'user', select: 'name' }]);

      userSocket.join(user.id);
      io.to(user.id).emit(SocketChannels.newJob, newJob);
      user.orders += 1;
      await user.save();

      cashier.forEach((user) => {
        const userSocket = io.sockets.sockets.get(user.id);
        if (userSocket) {
          userSocket.join(user.id);
          io.to(user.id).emit(SocketChannels.orderUpdated, newJob);
        }
      });
    }
    userIndex++;
  }

  jobs.orders = [];
  await jobs.save();
  user.token = undefined;
  user.online = false;
  user.orders = 0;
  await user.save();
  res.status(200).json({ message: 'success' });
};
