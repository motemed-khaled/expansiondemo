import 'express-async-errors';
import { Role } from '../../models/role.model';
import { GetRoleHandler } from '../../types/endpoints/role.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getRoleHandler: GetRoleHandler = async (req, res, next) => {
  const role = await Role.findById(req.params.roleId);
  if (!role) return next(new NotFoundError('role not found'));
  res.status(200).json({ message: 'success', data: role });
};
