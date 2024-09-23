import { check } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';

export const createRoleVal = [
  check('permission')
    .isArray()
    .notEmpty()
    .custom((val) => {
      return val.every((value: string) => typeof value === 'string');
    }),
  check('key').isString().notEmpty(),
  validationMiddleware,
];

export const getRoleVal = [check('roleId').isMongoId(), validationMiddleware];

export const updateRoleVal = [
  check('roleId').isMongoId(),
  check('permission.*').optional().isString().notEmpty(),
  check('key').optional().isString().notEmpty(),
  validationMiddleware,
];

export const removeRoleVal = [check('roleId').isMongoId(), validationMiddleware];
