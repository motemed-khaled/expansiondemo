import { RequestHandler } from 'express';

import { Irole } from '../roles';

type successResponse<T> = T & {
  message: 'success';
};

export interface CreateRoleHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Irole }>,
    Pick<Irole, 'permission' | 'key'>,
    unknown
  > {}

export interface UpdateRoleHandler
  extends RequestHandler<
    { roleId: string },
    successResponse<{ data: Irole }>,
    Partial<Pick<Irole, 'key' | 'permission'>>,
    unknown
  > {}

export interface GetRoleHandler
  extends RequestHandler<{ roleId: string }, successResponse<{ data: Irole }>, unknown, unknown> {}

export interface GetRolesHandler
  extends RequestHandler<unknown, successResponse<{ data: Irole[] }>, unknown, unknown> {}

export interface RemoveRoleHandler
  extends RequestHandler<{ roleId: string }, successResponse<unknown>, unknown, unknown> {}

export interface GetAllPermissionHandler
  extends RequestHandler<unknown, successResponse<{ data: string[] }>, unknown, unknown> {}
