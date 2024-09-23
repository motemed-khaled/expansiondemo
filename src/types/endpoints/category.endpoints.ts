import { RequestHandler } from 'express';

import { Icatogry } from '../catogry';
import { Iproduct } from '../product';

type successResponse<T> = T & {
  message: 'success';
};

export interface CreateCatogryHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Icatogry }>,
    Pick<Icatogry, 'name'>,
    unknown
  > {}

export interface UpdateCategoryHandler
  extends RequestHandler<
    { catogryId: string },
    successResponse<{ data: Icatogry }>,
    Pick<Icatogry, 'name'>,
    unknown
  > {}

export interface GetCatogriesHandler
  extends RequestHandler<unknown, successResponse<{ data: Icatogry[] }>, unknown, unknown> {}

export interface GetCatogryHandler
  extends RequestHandler<
    { catogryId: string },
    successResponse<{ data: Icatogry }>,
    unknown,
    unknown
  > {}

export interface DeleteCatogryHandler
  extends RequestHandler<{ catogryId: string }, successResponse<unknown>, unknown, unknown> {}

export interface GetProductBasedCatogryHandler
  extends RequestHandler<
    { catogryId: string },
    successResponse<{ data: Iproduct[] }>,
    unknown,
    unknown
  > {}
