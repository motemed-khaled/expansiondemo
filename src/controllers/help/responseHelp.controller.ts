import 'express-async-errors';
import { Help } from '../../models/helpAndTables.model';
import { User } from '../../models/stuff.model';
import { ResponseHelpHandler } from '../../types/endpoints/helpAndTables.endpoints';
import { SocketChannels } from '../../types/socketChannels';
import { SystemRole } from '../../types/systemRole';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const responseHelpController: ResponseHelpHandler = async (req, res, next) => {
  const help = await Help.findByIdAndUpdate(
    req.params.helpId,
    { help: false, user: null },
    { new: true },
  );
  const cashiers = await User.find({ typeId: SystemRole.cashier, online: true });
  const io = req.app.get('socketio');

  cashiers.forEach((cashier) => {
    const userSocket = io.sockets.sockets.get(cashier.id);
    if (userSocket) {
      userSocket.join(cashier.id);
      io.to(cashier.id).emit(SocketChannels.responseHelp, help);
    }
  });
  
  if (!help) return next(new NotFoundError('help not found'));
  res.status(200).json({ message: 'success', data: help });
};
