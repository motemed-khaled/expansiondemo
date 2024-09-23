import 'express-async-errors';
import { GetAllPermissionHandler } from '../../types/endpoints/role.endpoints';
import { Ifeatures } from '../../types/features';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getAllPermissionHandler: GetAllPermissionHandler = async (req, res, next) => {
  const permission = Object.values(Ifeatures);
  if (permission.length === 0) return next(new NotFoundError('permission not found'));
  res.status(200).json({ message: 'success', data: permission });
};
