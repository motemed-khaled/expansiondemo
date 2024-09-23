import { RequestHandler } from 'express';
import { Types } from 'mongoose';

import { Icart } from '../cart';

type successResponse<T> = T & {
  message: 'success';
};

export interface AddToCartHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Icart }>,
    { productId: string; quantity: number; extra: Types.ObjectId[] },
    unknown
  > {}

export interface GetLoggedUserCartHandler
  extends RequestHandler<unknown, successResponse<{ data: Icart }>, unknown, unknown> {}

export interface RemoveItemFromCartHandler
  extends RequestHandler<{ itemId: string }, successResponse<{ data: Icart }>, unknown, unknown> {}

export interface RemoveUserCartHandler
  extends RequestHandler<unknown, successResponse<unknown>, unknown, unknown> {}

export interface UpdateCartItemQuantityHandler
  extends RequestHandler<
    { itemId: string },
    successResponse<{ data: Icart }>,
    { quantity: number },
    unknown
  > {}
