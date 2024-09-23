import { check, query } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';
import { PaymentMethod } from '../types/order';

export const craeteOrderVal = [
  check('cartId').isMongoId(),
  check('tableNum').isNumeric(),
  check('description').optional().isString().notEmpty(),
  validationMiddleware,
];

export const getSpecificOrderVal = [check('orderId').isMongoId(), validationMiddleware];

export const updateIsPaidHandler = [check('orderId').isMongoId(), validationMiddleware];

export const removeOrderVal = [check('orderId').isMongoId(), validationMiddleware];

export const updateOrderStatusVal = [
  check('orderId').isMongoId(),
  check('orderStatus')
    .isString()
    .notEmpty()
    .custom((val) => {
      if (['1', '2', '3', '4'].includes(val)) return true;
      throw new Error('orderStatus must be string of 1,2,3,4');
    }),
  validationMiddleware,
];

export const getAllOrderVal = [
  check('orderStatus').optional().isArray().notEmpty(),
  query('isPaid')
    .optional()
    .isBoolean()
    .withMessage('isPaid must be a boolean value')
    .custom((val, { req }) => {
      if (!req.body.orderStatus) return true;
      throw new Error('not accept order status with query');
    }),
  check('startDate')
    .optional()
    .isISO8601()
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),
  check('endDate')
    .optional()
    .isISO8601()
    .custom((val,{req})=>{
      if (req.query?.startDate) return true;
      throw new Error('end date required with start date');
    })
    .withMessage('Date must be in ISO 8601 format (YYYY-MM-DD)'),
  validationMiddleware,
];

export const updatePaymentOrderVal = [
  check('payment')
    .isString()
    .custom((val) => {
      if (Object.values(PaymentMethod).includes(val)) return true;
      throw new Error(`payment must be value of : ${Object.values(PaymentMethod)}`);
    }),
  check('operationNumber').optional().isInt(),
  validationMiddleware,
];

export const updateOrderVal = [
  check('orderId').isMongoId(),
  check('products').isArray(),
  check('products.*.productId').isString(),
  check('products.*.quantity').isInt({ min: 0 }),
  check('payment')
    .optional()
    .custom((val) => {
      if (Object.values(PaymentMethod).includes(val)) return true;
      throw new Error(`payment must be value of : ${Object.values(PaymentMethod)}`);
    }),
  check('products.*.extra').optional().isArray(),
  validationMiddleware,
];

export const createCashierOrderVal = [
  check('list').isArray({ min: 1 }),
  check('list.*.productId').isString(),
  check('list.*.quantity').isInt({ min: 1 }),
  check('list.*.extra').optional().isArray(),
  check('tableNum')
    .optional()
    .isInt({ min: 1 })
    .custom((val, { req }) => {
      if (!req.body.TakeAway) return true;
      throw new Error('takeAway not valid with tableNum');
    }),
  check('TakeAway').optional().isBoolean(),
  check('description').optional().isString(),
  validationMiddleware,
];

export const getUserTotalOrderVal = [check('customerId').isMongoId(), validationMiddleware];

export const updateAllUserOrderPaymentVal = [
  check('payment').custom((val) => {
    if (Object.values(PaymentMethod).includes(val)) return true;
    throw new Error(`payment must be value of : ${Object.values(PaymentMethod)}`);
  }),
  check('operationNumber').optional().isInt(),
  validationMiddleware,
];
