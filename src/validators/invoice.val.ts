import { check } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';
import { PaymentMethod } from '../types/order';

export const createInvoiceVal = [
  check('orders').isArray({ min: 1 }),
  check('orders.*').isMongoId(),
  check('invoiceNum').isString(),
  check('paymentMethod').isIn(Object.values(PaymentMethod)),
  check('totalPrice').isFloat({ gt: 0 }),
  check('processNum').optional().isString(),
  validationMiddleware,
];

export const deleteInvoiceVal = [check('invoiceId').isMongoId(), validationMiddleware];

export const getInvoiceVal = [check('invoiceId').isMongoId(), validationMiddleware];

export const getAllInvoiceVal = [
  check('from')
    .optional()
    .isISO8601()
    .custom((val, { req }) => {
      if (req.query?.to) return true;
      throw new Error('to date required');
    }),
  check('to')
    .optional()
    .isISO8601()
    .custom((val, { req }) => {
      if (req.query?.from) return true;
      throw new Error('from date required');
    }),
  check('paymentMethod').optional().isIn(Object.values(PaymentMethod)),
  check('limit').optional().isInt(),
  check('page').optional().isInt(),
  check('orderId').optional().isMongoId(),
  validationMiddleware,
];
