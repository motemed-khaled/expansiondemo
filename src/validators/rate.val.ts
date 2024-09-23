import { check } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';

export const createRouteVal = [check('rate').notEmpty().isNumeric(), validationMiddleware];
