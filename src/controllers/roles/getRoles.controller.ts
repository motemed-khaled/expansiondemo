import 'express-async-errors';
import { Role } from '../../models/role.model';
import { GetRolesHandler } from '../../types/endpoints/role.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getRolesHandler: GetRolesHandler = async (req, res, next) => {
  const roles = await Role.find();
  if (roles.length === 0) return next(new NotFoundError('roles not found'));
  res.status(200).json({ message: 'success', data: roles });
};
