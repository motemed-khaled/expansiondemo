import 'express-async-errors';
import { Role } from '../../models/role.model';
import { CreateRoleHandler } from '../../types/endpoints/role.endpoints';
import { ServerError } from '../../utils/errors/server-error';

export const createRoleHandler: CreateRoleHandler = async (req, res, next) => {
  const role = await Role.create(req.body);
  if (!role) return next(new ServerError('failed to create role'));
  res.status(201).json({ message: 'success', data: role });
};
