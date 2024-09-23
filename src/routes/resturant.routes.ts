/* eslint-disable @typescript-eslint/no-unused-vars */
import express from 'express';
import { body } from 'express-validator';

import * as handler from '../controllers';
import { UserType, isAuth } from '../guards/IsAuth.guard';
import { isAuthorized } from '../guards/isAuthorized.guard';
import { globalUploadMiddleware } from '../middlewares/global-upload.middleware';
import { Ifeatures } from '../types/features';
import * as val from '../validators';

export const router = express.Router();

router.put('/super-admin/control', val.updatePlanVal, handler.updatePlanHandler);
router.put('/super-admin/plancontrol', val.updatePlanVal, handler.planControlHandler);
router.get('/test', handler.testApp);
router.post('/', val.createProfileval, handler.createResturantHandler);
router.get('/', handler.getResturantHandler);

router.use(isAuth([UserType.stuff]), isAuthorized(Ifeatures.updateResturantHandler));

router
  .route('/social/:resturantId')
  .post(
    globalUploadMiddleware({ fileType: 'image' }).fields([{ name: 'icon', maxCount: 1 }]),
    val.addSocialMediaVal,
    handler.addSocialMediaHandler,
  )
  .put(
    globalUploadMiddleware({ fileType: 'image' }).fields([{ name: 'icon', maxCount: 1 }]),
    val.updateSocialMediaVal,
    handler.updateSocialMediaHandler,
  );

router.delete(
  '/:resturantId/social/:socialId',
  val.deleteSocialMediaVal,
  handler.deleteSocialMediaHandler,
);

router.put(
  '/:resturantId',
  globalUploadMiddleware({ fileType: 'image' }).fields([
    { name: 'profileCover', maxCount: 1 },
    { name: 'imageProfile', maxCount: 1 },
  ]),
  val.updateProfileVal,
  handler.updateResturantHandler,
);
