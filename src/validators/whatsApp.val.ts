import { body } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';




export const sendMessageVal = [
  body('users').isArray({min:1}).withMessage('users must be an array'),
  body('users.*.').isArray({min:1}).withMessage('users must be an array of user object id'),
  body('messageBody').isString().exists().withMessage('messageBody must be string'),
  validationMiddleware
];