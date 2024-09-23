import { RequestHandler } from 'express';

import { Islider } from '../slider';

type successResponse<T> = T & {
  message: 'success';
};

export interface UpdateSliderHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Islider }>,
    Pick<Islider, 'images'> & { currentImages?: [string] },
    unknown
  > {}

export interface GetSliderHandler
  extends RequestHandler<unknown, successResponse<{ data: Islider }>, unknown, unknown> {}
