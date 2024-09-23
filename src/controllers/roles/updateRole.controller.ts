import 'express-async-errors';
import { Role } from '../../models/role.model';
import { UpdateRoleHandler } from '../../types/endpoints/role.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const updateRoleHandler: UpdateRoleHandler = async (req, res, next) => {
  const role = await Role.findByIdAndUpdate(req.params.roleId, req.body, { new: true });
  if (!role) return next(new NotFoundError('role not found'));
  res.status(200).json({ message: 'success', data: role });
};
