import { check } from 'express-validator';

import { validationMiddleware } from '../middlewares/global-validator.middleware';

export const updateProfileVal = [
  check('resturantId').isMongoId().withMessage('invalid id format'),
  check('name').optional().trim().notEmpty().withMessage('Name is required'),
  check('profileCover')
    .optional()
    .custom((val, { req }) => {
      if (req.files.profileCover) return true;
      throw new Error();
    })
    .withMessage('Invalid profile cover '),
  check('imageProfile')
    .optional()
    .custom((val, { req }) => {
      if (req.files.imageProfile) return true;
      throw new Error();
    })
    .withMessage('Invalid image profile '),
  check('twilioSid').optional().isString().exists().withMessage('twilioSid required'),
  check('twilioToken').optional().isString().exists().withMessage('twilioToken required'),
  check('twilioNumber').optional().isString().exists().withMessage('twilioNumber required'),
  check('rate').not().exists(),
  check('shippingPrice').optional().exists().isNumeric(),
  check('plan').not().exists(),
  check('plan.whatsAppService').not().exists(),
  check('plan.cleaner').not().exists(),
  check('plan.cashier').not().exists(),
  check('plan.waiter').not().exists(),
  check('plan.chief').not().exists(),
  check('plan.status').not().exists(),
  check('location').optional().isString(),
  check('cheifAlert').optional().isInt(),
  check('waiterAlert').optional().isInt(),
  check('TaxNumber').optional().isString(),
  check('CommercialRecord').optional().isString(),
  check('qrCodeLink').optional().isURL(),
  check('orgnizationName').optional().isString(),
  check('branchName').optional().isString(),
  validationMiddleware,
];

export const createProfileval = [
  check('name').trim().notEmpty().withMessage('name required'),
  validationMiddleware,
];

export const updatePlanVal = [check('status').optional().isBoolean(), validationMiddleware];

export const addSocialMediaVal = [
  check('resturantId').isMongoId().withMessage('invalid id format'),
  check('icon')
    .custom((val, { req }) => {
      if (req.files) return true;
      throw new Error();
    })
    .withMessage('Invalid icon'),
  check('link').isURL().withMessage('invalid url format'),
  validationMiddleware,
];

export const updateSocialMediaVal = [
  check('resturantId').isMongoId().withMessage('invalid id format'),
  check('socialId').isMongoId(),
  check('icon')
    .optional()
    .custom((val, { req }) => {
      if (req.files) return true;
      throw new Error();
    })
    .withMessage('Invalid icon'),
  check('link').optional().isURL().withMessage('invalid url format'),
  validationMiddleware,
];

export const deleteSocialMediaVal = [
  check('resturantId').isMongoId().withMessage('invalid id format'),
  check('socialId').isMongoId(),
  validationMiddleware,
];
