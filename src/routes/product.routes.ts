import express from 'express';

import * as handler from '../controllers/index';
import { isAuth, UserType } from '../guards/IsAuth.guard';
import { isAuthorized } from '../guards/isAuthorized.guard';
import { globalUploadMiddleware } from '../middlewares/global-upload.middleware';
import { Ifeatures } from '../types/features';
import * as val from '../validators/index';

export const router = express.Router();

router
  .route('/')
  .post(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.createProductHandler),
    globalUploadMiddleware({ fileType: 'image' }).fields([{ name: 'image', maxCount: 1 }]),
    val.createProductVal,
    handler.createProductHandler,
  )
  .get(val.getProducts , handler.getProductsHandler);

router
  .route('/:productId')
  .put(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.updateProductHandler),
    globalUploadMiddleware({ fileType: 'image' }).fields([{ name: 'image', maxCount: 1 }]),
    val.updateProductVal,
    handler.updateProductHandler,
  )
  .get(val.getProductVal, handler.getProductHandler)
  .delete(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.deleteProductHandler),
    val.deleteProduct,
    handler.deleteProductHandler,
  )
  .patch(isAuth([UserType.stuff]), val.updateProductStatusVal, handler.updateProductStatusHandler);
