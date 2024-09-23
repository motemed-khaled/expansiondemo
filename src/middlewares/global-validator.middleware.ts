import { RequestHandler } from 'express';
import { validationResult } from 'express-validator';

import { validationError } from '../utils/errors/validation-error';

export const validationMiddleware: RequestHandler = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return next(new validationError(errors.array()));
  next();
};
