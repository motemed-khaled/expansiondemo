import { RequestHandler } from 'express';

import { UserCycleResult } from '../../utils/orderAnalysiz';
import { Iorder } from '../order';

type successResponse<T> = T & {
  message: 'success';
};

export interface AllOrderAnalysisHandler
  extends RequestHandler<
    unknown,
    successResponse<{
      data: Iorder[];
      totalOrdersPrice?: number;
      ordersCount: number;
      customers: number;
    }>,
    unknown,
    { limit?: number; page?: number; from: Date; to: Date; paymentMethod?: string ; isPaid?:string }
  > {}

export interface OrderAnalysisHandler
  extends RequestHandler<
    { orderId: string },
    successResponse<{ data: Iorder; waiter: UserCycleResult; cheif: UserCycleResult }>,
    unknown,
    unknown
  > {}

export interface GetAllOrderByMonthHandler
  extends RequestHandler<
    unknown,
    successResponse<{
      data: { totalOrders: number; totalPrice: number; year: number; month: number }[];
    }>,
    unknown,
    unknown
  > {}

export interface GetAllOrderTotalPriceHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: { totalOrders: number; customer: number; ordersCount: number } }>,
    unknown,
    unknown
  > {}
