import 'express-async-errors';
import { User } from '../../models/stuff.model';
import { GetLoggedUserHandler } from '../../types/endpoints/stuff.endpoint';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getLoggedUserHandler: GetLoggedUserHandler = async (req, res, next) => {
  const user = await User.findById(req.loggedUser?.id).select('email name typeId token salary');
  if (!user) return next(new NotFoundError('user not found'));
  res.status(200).json({ message: 'success', data: user });
};
