import express from 'express';

import { isAuthorized } from './../guards/isAuthorized.guard';
import * as handler from '../controllers';
import { isAuth, UserType } from '../guards/IsAuth.guard';
import { Ifeatures } from '../types/features';
import * as val from '../validators/catogry.val';

export const router = express.Router();

router.get(
  '/:catogryId/products',
  val.getCatogryProductVal,
  handler.getProductBasedOnCatogryHandler,
);

router
  .route('/')
  .post(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.createCatogryHandler),
    val.createCatogryVal,
    handler.createCatogryHandler,
  )
  .get(handler.getCatogriesHandler);

router
  .route('/:catogryId')
  .put(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.updateCatogryHandler),
    val.updateCatogryVal,
    handler.updateCatogryHandler,
  )
  .get(val.getCatogryVal, handler.getCatogryHandler)
  .delete(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.deleteCatogryHandler),
    val.deleteCatogryVal,
    handler.deleteCatogryHandler,
  );
