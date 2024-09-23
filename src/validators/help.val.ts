import { check } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';

export const createHelpVal = [check('tableNum').isString().notEmpty(), validationMiddleware];

export const responseHelpVal = [check('helpId').isMongoId(), validationMiddleware];

export const getHelpHandlerVal = [check('helpId').isMongoId(), validationMiddleware];

export const removeHelpHandlerVal = [check('helpId').isMongoId(), validationMiddleware];

export const updateTableStatusVal = [check('tableNum').isString().notEmpty(), validationMiddleware];

export const addTablesVal = [check('numberOfTable').isInt({ min: 1 }), validationMiddleware];
