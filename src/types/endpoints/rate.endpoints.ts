import { RequestHandler } from 'express';

import { Irate } from '../rate';

type successResponse<T> = T & {
  message: 'success';
};

export interface CreateRateHandler
  extends RequestHandler<unknown, successResponse<unknown>, Pick<Irate, 'rate'>, unknown> {}
