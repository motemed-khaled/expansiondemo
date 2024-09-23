import { check } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';

export const createStoreVal = [
  check('name').isString().trim(),
  check('quantity').isFloat({ gt: 0 }),
  check('image').custom((value, { req }) => {
    if (!req.files || !req.files.image) {
      throw new Error('Image file is required');
    }
    return true;
  }),
  check('measruingUnit').isString().trim(),
  validationMiddleware,
];

export const updateStoreVal = [
  check('storeId').isMongoId(),
  check('name').optional().isString().trim(),
  check('quantity').optional().isFloat({ gt: 0 }),
  check('image')
    .optional()
    .custom((value, { req }) => {
      if (!req.files || !req.files.image) {
        throw new Error('Image file is required');
      }
      return true;
    }),
  check('measruingUnit').optional().isString().trim(),
  check('disQuantity')
    .optional()
    .isString()
    .custom((val, { req }) => {
      if (req.body.quantity) throw new Error('quantity not valid with disQuantity');
      return true;
    }),
  validationMiddleware,
];

export const getStoreVal = [check('storeId').isMongoId(), validationMiddleware];

export const deleteStoreVal = [check('storeId').isMongoId(), validationMiddleware];

export const addProductToStoreVal = [
  check('storeId').isMongoId(),
  check('product').isMongoId(),
  check('percent.from').isFloat({ gt: 0 }),
  check('percent.to').isFloat({ gt: 0 }),
  validationMiddleware,
];

export const updateProductInStoreVal = [
  check('storeId').isMongoId(),
  check('productId').isMongoId(),
  check('product').isMongoId(),
  check('percent.from').isFloat({ gt: 0 }),
  check('percent.to').isFloat({ gt: 0 }),
  validationMiddleware,
];

export const deleteProductFromStoreVal = [
  check('storeId').isMongoId(),
  check('productId').isMongoId(),
  validationMiddleware,
];
