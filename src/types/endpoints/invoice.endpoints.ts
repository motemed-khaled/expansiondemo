import { RequestHandler } from 'express';

import { Iinvoice } from '../invoice';

type successResponse<T> = T & {
  message: 'success';
};

export interface CreateInvoiceHandler
  extends RequestHandler<
    unknown,
    successResponse<unknown>,
    Pick<Iinvoice, 'orders' | 'invoiceNum' | 'paymentMethod' | 'totalPrice' | 'processNum'>,
    unknown
  > {}

export interface DeleteInvoiceHandler
  extends RequestHandler<{ invoiceId: string }, successResponse<unknown>, unknown, unknown> {}

export interface GetInvoiceHandler
  extends RequestHandler<
    { invoiceId: string },
    successResponse<{ data: Iinvoice }>,
    unknown,
    unknown
  > {}

export interface GetAllInvoiceHandler
  extends RequestHandler<
    unknown,
    successResponse<{ data: Iinvoice[]; totalInvoicePrice: number; totalInvoices: number }>,
    unknown,
    {
      page?: number;
      limit?: number;
      paymentMethod?: string;
      from?: Date;
      to?: Date;
      orderId?: string;
    }
  > {}
