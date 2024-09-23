import { RequestHandler } from 'express';

import { Istore } from '../store';

type successResponse<T> = T & {
  message: 'success';
};

export interface CreateStoreHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Istore }>,
    Pick<Istore, 'name' | 'quantity' | 'image' | 'measruingUnit'>,
    unknown
  > {}

export interface UpdateStoreHandler
  extends RequestHandler<
    { storeId: string },
    successResponse<{ data: Istore }>,
    Partial<
      Pick<Istore, 'name' | 'quantity' | 'image' | 'measruingUnit'> & { disQuantity: number }
    >,
    unknown
  > {}

export interface GetStoreHandler
  extends RequestHandler<
    { storeId: string },
    successResponse<{ data: Istore }>,
    unknown,
    unknown
  > {}

export interface GetStoresHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Istore[] }>,
    unknown,
    { limit?: number; page?: number; name?: string }
  > {}

export interface DeleteStoreHandler
  extends RequestHandler<{ storeId: string }, successResponse<unknown>, unknown, unknown> {}

export interface AddProductToStoreHandler
  extends RequestHandler<
    { storeId: string },
    successResponse<{ data: Istore }>,
    { product: string; percent: { from: number; to: number } },
    unknown
  > {}

export interface UpdateProductInStoreHandler
  extends RequestHandler<
    { storeId: string; productId: string },
    successResponse<{ data: Istore }>,
    { product: string; percent: { from: number; to: number } },
    unknown
  > {}

export interface DeleteProductFromStoreHandler
  extends RequestHandler<
    { storeId: string; productId: string },
    successResponse<unknown>,
    unknown,
    unknown
  > {}
