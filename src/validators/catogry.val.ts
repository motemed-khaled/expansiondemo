import { check } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';

export const createCatogryVal = [
  check('name').trim().notEmpty().withMessage('name is required'),
  validationMiddleware,
];

export const updateCatogryVal = [
  check('catogryId').isMongoId().withMessage('invalid catogry id foramt'),
  check('name').notEmpty(),

  validationMiddleware,
];

export const getCatogryVal = [
  check('catogryId').isMongoId().withMessage('invalid catogry id format'),
  validationMiddleware,
];

export const deleteCatogryVal = [
  check('catogryId').isMongoId().withMessage('invalid catogry id format'),
  validationMiddleware,
];

export const getCatogryProductVal = [
  check('catogryId').isMongoId().withMessage('invalid catogry id format'),
  validationMiddleware,
];
