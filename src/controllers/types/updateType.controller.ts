import 'express-async-errors';
import { Role } from '../../models/role.model';
import { Type } from '../../models/types.model';
import { UpdateTypeHandler } from '../../types/endpoints/types.endpoints';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const updateTypeHandler: UpdateTypeHandler = async (req, res, next) => {
  if (req.body.roleId) {
    const role = await Role.findById(req.body.roleId);
    if (!role) return next(new BadRequestError('role not found'));
  }
  const updateType = await Type.findByIdAndUpdate(req.params.typeId, req.body, { new: true });
  if (!updateType) return next(new NotFoundError('type not found'));
  res.status(200).json({ message: 'success', data: updateType });
};
