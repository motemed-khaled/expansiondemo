import { RequestHandler } from 'express';

import { IwaitingList } from '../../types/waitingList';

type successResponse<T> = T & {
  message: 'success';
};

export interface CreateWaitingListHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: IwaitingList }>,
    Pick<IwaitingList, 'name' | 'phone' | 'team'>,
    unknown
  > {}

export interface DeleteWaitingListHandler
  extends RequestHandler<{ waitingId: string }, successResponse<unknown>, unknown, unknown> {}

export interface GetAllWatingListHandler
  extends RequestHandler<unknown, successResponse<{ data: IwaitingList[] }>, unknown, unknown> {}

export interface DeleteAllWaitingListHandler
  extends RequestHandler<unknown, successResponse<unknown>, unknown, unknown> {}
