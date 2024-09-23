import { RequestHandler } from 'express';

import { Iproduct } from '../product';

type successResponse<T> = T & {
  message: 'success';
};

export interface CreateProductHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Iproduct }>,
    Pick<Iproduct, 'name' | 'desc' | 'image' | 'catogryId' | 'price' | 'calories' | 'extra'>,
    unknown
  > {}

export interface UpdateProductHandler
  extends RequestHandler<
    { productId: string },
    successResponse<{ data: Iproduct }>,
    Partial<
      Pick<Iproduct, 'name' | 'catogryId' | 'price' | 'desc' | 'image' | 'calories' | 'extra'>
    >,
    unknown
  > {}

export interface GetProductHandler
  extends RequestHandler<
    { productId: string },
    successResponse<{ data: Iproduct }>,
    unknown,
    unknown
  > {}

export interface GetProductsHandler
  extends RequestHandler<unknown, successResponse<{ data: Iproduct[] }>, unknown, unknown> {}

export interface DeleteProductHandler
  extends RequestHandler<{ productId: string }, successResponse<unknown>, unknown, unknown> {}

export interface UpdateProductStatusHandler
  extends RequestHandler<
    { productId: string },
    successResponse<{ data: Iproduct }>,
    unknown,
    unknown
  > {}
