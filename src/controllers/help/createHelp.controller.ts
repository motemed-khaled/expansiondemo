import 'express-async-errors';
import { Help } from '../../models/helpAndTables.model';
import { Resturant } from '../../models/resturant.model';
import { User } from '../../models/stuff.model';
import { CreateHelpHandler } from '../../types/endpoints/helpAndTables.endpoints';
import { SocketChannels } from '../../types/socketChannels';
import { SystemRole } from '../../types/systemRole';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { NotFoundError } from '../../utils/errors/notfound-error';
import { scheduleWaiterHelp } from '../../utils/queue/scheduleNotification';

export const createHelpHandler: CreateHelpHandler = async (req, res, next) => {
  const resturant = await Resturant.find();
  if (resturant.length === 0) return next(new NotFoundError('resturant not found'));
  const users: string[] = [];
  let help = await Help.findOne({ tableNum: req.body.tableNum, help: false });
  if (!help) return next(new BadRequestError('help already created'));

  const user = await User.find({ typeId: SystemRole.waiter, online: true })
    .sort({ orders: 1 })
    .limit(1);

  const ifWaiter = await User.findOne({typeId:SystemRole.waiter});


  if (ifWaiter) return next(new BadRequestError('sorry no waiter available Right now'));

  help = await Help.findByIdAndUpdate(
    help.id,
    { help: true, tableStatus: 'busy', customerId: req.loggedUser?.id, isRed: false },
    { new: true },
  );
  if (!help) return next(new NotFoundError('table not found'));
  const cashier = await User.find({ typeId: SystemRole.cashier, online: true });
  cashier.forEach(async (user) => users.push(user.id));

  if (cashier.length === 0 )return next(new BadRequestError('sorry no waiter or cashier available Right now'));

  help.user = user[0].id || null;
  help = await (await help.save()).populate([{ path: 'user', select: 'name' }]);
  user[0].orders += 1;
  await user[0].save();
  users.push(user[0].id);

  const io = req.app.get('socketio');

  users.forEach((user) => {
    const userSocket = io.sockets.sockets.get(user);
    if (userSocket) {
      userSocket.join(user);
      io.to(user).emit(SocketChannels.helpCreated, help);
    }
  });
  const delay = resturant[0].waiterAlert * 60 * 1000 || 3 * 60 * 1000;

  await scheduleWaiterHelp.add(
    {
      helpId: help.id,
      userId: user[0].id,
    },
    {
      delay,
    },
  );

  res.status(201).json({ message: 'success', data: help });
};
