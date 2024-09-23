import { RequestHandler } from 'express';

import { Iorder } from '../order';

type successResponse<T> = T & {
  message: 'success';
};

export interface GetUserJobHandler
  extends RequestHandler<unknown, successResponse<{ data: Iorder }>, unknown, unknown> {}
