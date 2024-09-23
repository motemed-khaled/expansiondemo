import { check } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';

export const createTypeVal = [
  check('key').isString().notEmpty(),
  check('roleId').isMongoId(),
  validationMiddleware,
];

export const updateTypeVal = [
  check('typeId').isMongoId(),
  check('key').optional().isString().notEmpty(),
  check('roleId').optional().isMongoId(),
  validationMiddleware,
];

export const getTypeVal = [check('typeId').isMongoId(), validationMiddleware];

export const removeTypeVal = [check('typeId').isMongoId(), validationMiddleware];
