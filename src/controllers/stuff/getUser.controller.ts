import 'express-async-errors';
import { User } from '../../models/stuff.model';
import { GetUserHandler } from '../../types/endpoints/stuff.endpoint';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getUserHandler: GetUserHandler = async (req, res, next) => {
  const user = await User.findById(req.params.userId).select('name email typeId salary');
  if (!user) return next(new NotFoundError('user not found'));
  res.status(200).json({ message: 'success', data: user });
};
