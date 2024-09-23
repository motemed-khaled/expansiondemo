import { check } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';

export const createWaitingVal = [
  check('name').isString().notEmpty(),
  check('phone').isString(),
  check('team').isInt({ min: 1 }),
  validationMiddleware,
];

export const deleteWaitingVal = [check('waitingId').isMongoId(), validationMiddleware];
