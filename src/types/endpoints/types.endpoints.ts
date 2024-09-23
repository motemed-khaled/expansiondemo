import { RequestHandler } from 'express';

import { Itype } from '../../types/types';

type successResponse<T> = T & {
  message: 'success';
};

export interface CreateTypeHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Itype }>,
    { key: string; roleId: string },
    unknown
  > {}

export interface UpdateTypeHandler
  extends RequestHandler<
    { typeId: string },
    successResponse<{ data: Itype }>,
    Partial<Pick<Itype, 'key' | 'roleId'>>,
    unknown
  > {}

export interface GetTypeHandler
  extends RequestHandler<{ typeId: string }, successResponse<{ data: Itype }>, unknown, unknown> {}

export interface GetTypesHandler
  extends RequestHandler<unknown, successResponse<{ data: Itype[] }>, unknown, unknown> {}

export interface RemoveTypeHandler
  extends RequestHandler<{ typeId: string }, successResponse<unknown>, unknown, unknown> {}
