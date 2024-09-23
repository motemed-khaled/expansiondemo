import { check } from 'express-validator';
import mongoose from 'mongoose';

import { validationMiddleware } from '../middlewares/global-validator.middleware';

export const createProductVal = [
  check('name').notEmpty(),
  check('desc').optional().notEmpty(),
  check('catogryId').isMongoId(),
  check('price').notEmpty(),
  check('calories').notEmpty(),
  check('extra').optional().isArray(),
  check('extra.*')
    .optional()
    .custom(async (value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid ObjectId');
      }
    }),
  validationMiddleware,
];

export const updateProductVal = [
  check('name').optional().notEmpty(),
  check('desc').optional().notEmpty(),
  check('catogryId').optional().isMongoId(),
  check('price').optional().notEmpty(),
  check('calories').optional().notEmpty(),
  validationMiddleware,
];

export const getProductVal = [check('productId').isMongoId(), validationMiddleware];

export const deleteProduct = [check('productId').isMongoId(), validationMiddleware];

export const updateProductStatusVal = [check('productId').isMongoId(), validationMiddleware];
