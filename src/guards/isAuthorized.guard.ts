import { RequestHandler } from 'express';

import { Role } from '../models/role.model';
import { Type } from '../models/types.model';
import { NotFoundError } from '../utils/errors/notfound-error';
import { UnauthorizedError } from '../utils/errors/un-authorizedError';

export const isAuthorized = (permission: string) => <RequestHandler>(async (req, res, next) => {
    if (req.loggedUser?.userType === 'admin') return next();

    if (!req.loggedUser?.typeId) return next(new UnauthorizedError());

    const type = await Type.findById(req.loggedUser.typeId);
    if (!type) return next(new NotFoundError('type not found'));

    const role = await Role.findById(type.roleId);
    if (!role) return next(new NotFoundError('role not found'));

    if (!role.permission.includes(permission)) return next(new UnauthorizedError());
    return next();
  });
