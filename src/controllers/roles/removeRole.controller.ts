import 'express-async-errors';
import { Role } from '../../models/role.model';
import { RemoveRoleHandler } from '../../types/endpoints/role.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const removeRoleHandler: RemoveRoleHandler = async (req, res, next) => {
  const role = await Role.findByIdAndDelete(req.params.roleId);
  if (!role) return next(new NotFoundError('role not found'));
  res.status(204).json({ message: 'success' });
};
