import { check } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';
import { PaymentMethod } from '../types/order';

export const ordersAalysisVal = [
  check('from').isISO8601(),
  check('to').optional().isISO8601(),
  check('paymentMethod').optional().isIn(Object.values(PaymentMethod)),
  check('isPaid').optional().isBoolean(),
  validationMiddleware,
];
