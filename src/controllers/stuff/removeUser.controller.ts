import 'express-async-errors';
import { User } from '../../models/stuff.model';
import { RemoveUserHandler } from '../../types/endpoints/stuff.endpoint';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const removeUserHandler: RemoveUserHandler = async (req, res, next) => {
  const foundedUser = await User.findById(req.params.userId);
  if (!foundedUser) return next(new NotFoundError('user not found'));
  if (foundedUser.type === 'admin') return next(new BadRequestError('cant delete this account'));
  const user = await User.findByIdAndDelete(req.params.userId);
  if (!user) return next(new NotFoundError('user not found'));
  res.status(200).json({ message: 'success' });
};
