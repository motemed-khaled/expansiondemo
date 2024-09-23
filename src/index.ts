/* eslint-disable no-unsafe-optional-chaining */
import jwt from 'jsonwebtoken';
import { Server } from 'socket.io';


import { app } from './app';
import { dbConnection } from './config/database_connection';
import { checkEnvVariables, env } from './config/env';
import { UserType } from './guards/IsAuth.guard';
import { ConnectionTime } from './models/connectionTime.model';
import { Customer } from './models/customer.model';
import { Help } from './models/helpAndTables.model';
import { Job } from './models/jobs.model';
import { Order } from './models/order.model';
import { User } from './models/stuff.model';
import { SystemRole } from './types/systemRole';
import { UnauthenticatedError } from './utils/errors/unauthenticated-error';
import { IjwtPayload } from './utils/generateToken';

let io: Server;

export function getSocketIOInstance(): Server {
  if (!io) {
    throw new Error('Socket.IO instance has not been initialized');
  }
  return io;
}

const start = async () => {
  checkEnvVariables();
  await dbConnection();

  const server = app.listen(env.port, () => {
    console.log(`server listen in port... : ${env.port}`);
  });
  io = new Server(server, {
    cors: {
      origin: '*',
    },
  });

  io.use(async (socket, next) => {
    try {
      if (!socket.handshake.headers.authorization) throw new UnauthenticatedError();
      const token = (socket.handshake.headers.authorization!.split(' ')[1] as string) ?? '';

      const payload = jwt.verify(token, process.env.JWT_KEY!) as IjwtPayload;
      if (payload.type === UserType.stuff) {
        const user = await User.findOne({ token });
        if (!user) throw new Error('Unauthenticated error');
        (socket as any).loggedUser = payload;
      }
      if (payload.type === UserType.customer) {
        const user = await Customer.findOne({ token });
        if (!user) throw new Error('Unauthenticated error');
        (socket as any).loggedUser = payload;
      }
      next();
    } catch (error) {
      next(new UnauthenticatedError());
    }
  }).on('connection', async (socket) => {
    const userId = (socket as any).loggedUser.id;
    io.sockets.sockets.set(userId, socket);
    const updatedUser = await User.findByIdAndUpdate(userId, {
      online: true,
    });

    if (updatedUser?.typeId.toString() === SystemRole.cleaner) {
      const jobs = await Job.findOne({ type: SystemRole.cleaner, user: { $exists: false } });

      if (jobs && jobs.orders.length > 0) {
        let userJob = await Job.findOne({ type: SystemRole.cleaner, user: userId });

        if (userJob) {
          userJob.orders.push(...jobs.orders);
        } else {
          userJob = await Job.create({
            type: SystemRole.cleaner,
            user: userId,
            orders: jobs.orders,
          });
        }

        jobs.orders = [];
        await jobs.save();
        await userJob.save();

        for (const order of userJob.orders) {
          const newOrder = await Order.findOneAndUpdate(
            { _id: order },
            { user: userId },
            { new: true },
          );
          await Help.findOneAndUpdate({ tableNum: newOrder?.tableNum }, { user: userId });
        }
      }
    }

    const startTime = Date.now();

    socket.on('disconnect', async () => {
      await User.findByIdAndUpdate(userId, {
        online: false,
      });

      if (startTime) {
        const endTime = Date.now();
        const connectionDuration = endTime - startTime;

        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);

        await ConnectionTime.findOneAndUpdate(
          { user: userId, date: currentDate },
          { $inc: { totalConnectionTime: connectionDuration } },
          { new: true, upsert: true },
        );
      }
    });
  });
  app.set('socketio', io);
};

start();
