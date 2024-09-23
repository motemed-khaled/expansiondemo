import { RequestHandler } from 'express';

import { Ihelp } from '../help';

type successResponse<T> = T & {
  message: 'success';
};

export interface CreateHelpHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Ihelp }>,
    { tableNum: string },
    unknown
  > {}

export interface ResponseHelpHandler
  extends RequestHandler<{ helpId: string }, successResponse<{ data: Ihelp }>, unknown, unknown> {}

export interface GetHelpsHandler
  extends RequestHandler<unknown, successResponse<{ data: Ihelp[] }>, unknown, unknown> {}

export interface GetHelpHandler
  extends RequestHandler<{ helpId: string }, successResponse<{ data: Ihelp }>, unknown, unknown> {}

export interface RemoveHelpHandler
  extends RequestHandler<{ helpId: string }, successResponse<unknown>, unknown, unknown> {}

export interface UpdateTableStatusHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Ihelp }>,
    { tableNum: string },
    unknown
  > {}

export interface GetAllCleanerJobHandler
  extends RequestHandler<unknown, successResponse<{ data: Ihelp[] }>, unknown, unknown> {}

export interface GetAllTablesHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Ihelp[] }>,
    unknown,
    { status?: 'ready' | 'busy'; tableNumber?: string }
  > {}

export interface AddTablesHandler
  extends RequestHandler<unknown, successResponse<unknown>, { numberOfTable: number }, unknown> {}
