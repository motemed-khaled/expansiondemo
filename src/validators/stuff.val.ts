import { check } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';

export const createUserVal = [
  check('email').isEmail(),
  check('name').isString().notEmpty(),
  check('typeId').isMongoId(),
  check('password').isString().notEmpty().isLength({ min: 8, max: 30 }),
  check('token').not().exists(),
  check('type').not().exists(),
  check('salary').isInt(),
  validationMiddleware,
];

export const updateUserVal = [
  check('userId').isMongoId(),
  check('email').optional().isEmail(),
  check('name').optional().isString().notEmpty(),
  check('typeId').optional().isMongoId(),
  check('password').optional().isString().notEmpty(),
  check('token').not().exists(),
  check('type').not().exists(),
  check('salary').optional().isInt(),
  validationMiddleware,
];

export const getUserVal = [check('userId').isMongoId(), validationMiddleware];

export const removeUserVal = [check('userId').isMongoId(), validationMiddleware];

export const userLoginValidation = [
  check('email').isEmail(),
  check('password').notEmpty(),
  validationMiddleware,
];

export const userLoggedOutVal = [check('userId').isMongoId(), validationMiddleware];

export const getAllUsersVal = [
  check('fromDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Invalid date format. Date should be in the format YYYY-MM-DD.')
    .custom((val, { req }) => {
      if (req.query!.toDate) return true;
      throw new Error('toDate Required');
    }),
  check('toDate')
    .optional()
    .matches(/^\d{4}-\d{2}-\d{2}$/)
    .withMessage('Invalid date format. Date should be in the format YYYY-MM-DD.'),
  validationMiddleware,
];
