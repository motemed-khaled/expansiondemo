import { check, query } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';

export const SignUpVal = [
  check('phone').isString().withMessage('invalid phone number'),
  validationMiddleware,
];

export const getCustomerVal = [
  check('customerId').isMongoId().withMessage('invalid id format'),
  validationMiddleware,
];

export const validateCustomerQueries = [
  query('phone').optional().isString().withMessage('Phone must be a string'),
  query('name').optional().isString().withMessage('Name must be a string'),
  query('address').optional().isString().withMessage('Address must be a string'),
  query('typeId').optional().isMongoId().withMessage('TypeId must be a valid MongoId'),
  query('word').optional().isString().withMessage('Word must be a string'),
  query('fromDate').optional().isISO8601().toDate().withMessage('From date must be a valid date'),
  query('toDate').optional().isISO8601().toDate().withMessage('To date must be a valid date'),
  validationMiddleware
];

export const deleteCustomerVal = [
  check('customerId').isMongoId().withMessage('invalid id format'),
  validationMiddleware,
];

export const createCustomerVal = [
  check('phone').isString().withMessage('invalid phone number'),
  check('name').isString().isLength({min:3 , max:40}).withMessage('name must be between 3 to 40 character'),
  check('location').isArray({min:1}).withMessage('location must be an array'),
  check('location.*').isObject().withMessage('must be object'),
  check('location.*.address').isString().isLength({min:20 , max:100}).withMessage('address must be between 20 to 100 character'),
  validationMiddleware
];

export const updateCustomerVal = [
  check('customerId').isMongoId().withMessage('invalid id format'),
  check('phone').optional().isString().withMessage('invalid phone number'),
  check('name').optional().isString().isLength({min:3 , max:40}).withMessage('name must be between 3 to 40 character'),
  check('location').not().exists().withMessage('location must not exist here'),
  validationMiddleware
];

export const addLocationVal = [
  check('customerId').isMongoId().withMessage('invalid id format'),
  check('address').isString().isLength({min:20 , max:100}).withMessage('address must be between 20 to 100 character'),
  validationMiddleware
];

export const updateLocationVal = [
  check('customerId').isMongoId().withMessage('invalid id format'),
  check('addressId').isMongoId().withMessage('invalid id format'),
  check('address').isString().isLength({min:20 , max:100}).withMessage('address must be between 20 to 100 character'),
  validationMiddleware
];

export const deleteLocationVal = [
  check('customerId').isMongoId().withMessage('invalid id format'),
  check('addressId').isMongoId().withMessage('invalid id format'),
  validationMiddleware
];