import Queue from 'bull';

import { env } from '../../config/env';
import { getSocketIOInstance } from '../../index';
import { Help } from '../../models/helpAndTables.model';
import { Order } from '../../models/order.model';
import { User } from '../../models/stuff.model';
import { SocketChannels } from '../../types/socketChannels';
import { SystemRole } from '../../types/systemRole';

interface IchiefAlert {
  orderId: string;
  userId: string;
}

export const scheduleCheif = new Queue<IchiefAlert>('cheif:alert', env.redis.uri);

scheduleCheif.process(async (job) => {
  try {
    const order = await Order.findById(job.data.orderId);
    if (!order) throw new Error(`order not found : ${job.data.orderId}`);
    if (['1', '2'].includes(order.orderStatus)) {
      const cashiers = await User.find({ typeId: SystemRole.cashier, online: true });
      const users = cashiers.map((user) => user.id);
      users.push(job.data.userId);
      const io = getSocketIOInstance();

      users.forEach((user) => {
        const userSocket = io.sockets.sockets.get(user);
        if (userSocket) {
          userSocket.join(user);
          io.to(user).emit(SocketChannels.cheifAlert, { orderId: order.id });
        }
      });
      order.isRed = true;
      await order.save();
    }
    order.isRed = false;
    await order.save();
  } catch (error) {
    return new Error('failed to send notification to cheif');
  }
});

interface IwaiterAlert {
  orderId: string;
  userId: string;
}

export const scheduleWaiter = new Queue<IwaiterAlert>('waiter:alert', env.redis.uri);

scheduleWaiter.process(async (job) => {
  try {
    const order = await Order.findById(job.data.orderId);
    if (!order) throw new Error(`order not found : ${job.data.orderId}`);

    if (['3'].includes(order.orderStatus)) {
      const cashiers = await User.find({ typeId: SystemRole.cashier, online: true });
      const users = cashiers.map((user) => user.id);
      users.push(job.data.userId);
      const io = getSocketIOInstance();

      users.forEach((user) => {
        const userSocket = io.sockets.sockets.get(user);
        if (userSocket) {
          userSocket.join(user);
          io.to(user).emit(SocketChannels.cheifAlert, { orderId: order.id });
        }
      });
    }
    order.isRed = false;
    await order.save();
  } catch (error) {
    return new Error('failed to send notification to waiter');
  }
});
interface IwaiterHelpAlert {
  helpId: string;
  userId: string;
}

export const scheduleWaiterHelp = new Queue<IwaiterHelpAlert>('waiterHelp:alert', env.redis.uri);

scheduleWaiterHelp.process(async (job) => {
  try {
    const currentHelp = await Help.findById(job.data.helpId);
    if (!currentHelp) throw new Error(`order not found : ${job.data.helpId}`);
    if (currentHelp.help) {
      const cashiers = await User.find({ typeId: SystemRole.cashier, online: true });
      const users = cashiers.map((user) => user.id);
      users.push(job.data.userId);
      const io = getSocketIOInstance();

      users.forEach((user) => {
        const userSocket = io.sockets.sockets.get(user);
        if (userSocket) {
          userSocket.join(user);
          io.to(user).emit(SocketChannels.helpAlert, { helpId: currentHelp.id });
        }
      });
      currentHelp.isRed = true;
      await currentHelp.save();
    }
  } catch (error) {
    return new Error('failed to send notification to waiter');
  }
});
