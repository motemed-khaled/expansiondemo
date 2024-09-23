import 'express-async-errors';
import { Role } from '../../models/role.model';
import { Type } from '../../models/types.model';
import { CreateTypeHandler } from '../../types/endpoints/types.endpoints';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { ServerError } from '../../utils/errors/server-error';

export const createTypeHandler: CreateTypeHandler = async (req, res, next) => {
  const role = await Role.findById(req.body.roleId);
  if (!role) return next(new BadRequestError('role not found'));
  const type = await Type.create(req.body);
  if (!type) return next(new ServerError('faield to create type'));
  res.status(201).json({ message: 'success', data: type });
};
