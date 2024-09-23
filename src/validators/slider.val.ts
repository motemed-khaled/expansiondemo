import { check } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';

export const updateSliderVal = [
  check('currentImages').optional().isArray({ min: 1 }),
  check('images')
    .optional()
    .notEmpty()
    .custom((val, { req }) => {
      if (req.files) return true;
      throw new Error('images required');
    }),
  validationMiddleware,
];
