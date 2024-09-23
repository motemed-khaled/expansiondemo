import { RequestHandler } from 'express';

import { Istuff } from '../stuff';

export type successResponse<T> = T & {
  message: 'success';
};

export interface CreateUserHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Pick<Istuff, 'name' | 'email' | 'typeId' | 'token' | 'salary'> }>,
    Pick<Istuff, 'email' | 'name' | 'typeId' | 'password' | 'salary'>,
    unknown
  > {}

export interface UpdateUserHandler
  extends RequestHandler<
    { userId: string },
    successResponse<{ data: Pick<Istuff, 'name' | 'email' | 'typeId' | 'token'> }>,
    Partial<Pick<Istuff, 'name' | 'password' | 'typeId' | 'email' | 'salary'>>,
    unknown
  > {}

export interface GetUserHandler
  extends RequestHandler<
    { userId: string },
    successResponse<{ data: Pick<Istuff, 'name' | 'email' | 'typeId' | 'token' | 'salary'> }>,
    unknown,
    unknown
  > {}

export interface GetUsersHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Pick<Istuff, 'name' | 'email' | 'typeId' | 'token' | 'salary'>[] }>,
    unknown,
    { online?: string; fromDate?: string; toDate?: string }
  > {}

export interface RemoveUserHandler
  extends RequestHandler<{ userId: string }, successResponse<unknown>, unknown, unknown> {}

export interface GetLoggedUserHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Pick<Istuff, 'name' | 'email' | 'typeId' | 'token'> }>,
    unknown,
    unknown
  > {}

export interface UserLoginHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Pick<Istuff, 'name' | 'email' | 'typeId' | 'token'> }>,
    { email: string; password: string },
    unknown
  > {}

export interface UserLoggedOutHandler
  extends RequestHandler<{ userId: string }, successResponse<unknown>, unknown, unknown> {}
