import { RequestHandler } from 'express';
import { Types } from 'mongoose';

import { Iorder } from '../order';

type successResponse<T> = T & {
  message: 'success';
};

export interface CreateCashOrderHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Iorder }>,
    { cartId: string; tableNum: number; description: string },
    unknown
  > {}

export interface GetSpecificOrderHandler
  extends RequestHandler<
    { orderId: string },
    successResponse<{ data: Iorder }>,
    unknown,
    unknown
  > {}

export interface GetUserOrdersHandler
  extends RequestHandler<unknown, successResponse<{ data: Iorder[] }>, unknown, unknown> {}

export interface UpdateIsPaidHandler
  extends RequestHandler<
    { orderId: string },
    successResponse<{ data: Iorder }>,
    unknown,
    unknown
  > {}

export interface GetAllOrderHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Iorder[]; total: number }>,
    { orderStatus?: [string] },
    { isPaid?: boolean; limit?: number; page?: number; tableNum?: number , endDate?:Date , startDate?:Date }
  > {}

export interface RemoveOrderHandler
  extends RequestHandler<{ orderId: string }, successResponse<unknown>, unknown, unknown> {}

export interface UpdateOrderStatusHandler
  extends RequestHandler<
    { orderId: string },
    successResponse<{ data: Iorder }>,
    { orderStatus: string },
    unknown
  > {}

export interface UpdateOrderPaymentHandler
  extends RequestHandler<
    { OrderId: string },
    successResponse<unknown>,
    { payment: 'نقدى' | 'شبكة' | 'بطاقة ائتمانية'; operationNumber?: number },
    unknown
  > {}

export interface UpdateOrderHandler
  extends RequestHandler<
    { orderId: string },
    successResponse<{ data: Iorder }>,
    {
      products: [{ productId: string; quantity: number; extra?: Types.ObjectId[] }];
      payment?: 'نقدى' | 'شبكة' | 'بطاقة ائتمانية';
    },
    unknown
  > {}

export interface CreateCashierOrderHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Iorder }>,
    {
      list: [{ productId: string; quantity: number; extra?: Types.ObjectId[] }];
      tableNum?: number;
      TakeAway?: boolean;
      description?: string;
    },
    unknown
  > {}

export interface GetTotalUserOrderHandler
  extends RequestHandler<
    { customerId: string },
    successResponse<{ data: { totalPrice: number } }>,
    unknown,
    unknown
  > {}

export interface UpdateAllUserOrderPaymentHandler
  extends RequestHandler<
    unknown,
    successResponse<unknown>,
    { payment: 'نقدى' | 'شبكة' | 'بطاقة ائتمانية'; operationNumber?: number },
    unknown
  > {}
