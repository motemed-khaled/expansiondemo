import { check } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';

export const addToCartVal = [
  check('productId').isMongoId(),
  check('quantity').optional().isNumeric(),
  validationMiddleware,
];

export const removeItemFromCartVal = [check('itemId').isMongoId(), validationMiddleware];

export const updateCartItemQuantity = [
  check('itemId').isMongoId(),
  check('quantity').isNumeric(),
  validationMiddleware,
];
