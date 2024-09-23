import express from 'express';

import * as handler from '../controllers';
import { isAuth, UserType } from '../guards/IsAuth.guard';
import { isAuthorized } from '../guards/isAuthorized.guard';
import { globalUploadMiddleware } from '../middlewares/global-upload.middleware';
import { Ifeatures } from '../types/features';
import * as val from '../validators/store.val';

export const router = express.Router();

router.use(isAuth([UserType.stuff]));

router
  .route('/:storeId/product/:productId')
  .delete(
    isAuthorized(Ifeatures.deleteProductStore),
    val.deleteProductFromStoreVal,
    handler.deleteProductFromStoreHandler,
  )
  .put(
    isAuthorized(Ifeatures.updateProductStore),
    val.updateProductInStoreVal,
    handler.updateProductInStoreHandler,
  );

router
  .route('/')
  .post(
    isAuthorized(Ifeatures.createStore),
    globalUploadMiddleware({ fileType: 'image' }).fields([{ name: 'image', maxCount: 1 }]),
    val.createStoreVal,
    handler.createStoreHandler,
  )
  .get(handler.getStoresHandler);

router
  .route('/:storeId')
  .put(
    isAuthorized(Ifeatures.updateStore),
    globalUploadMiddleware({ fileType: 'image' }).fields([{ name: 'image', maxCount: 1 }]),
    val.updateStoreVal,
    handler.updateStoreHandler,
  )
  .delete(isAuthorized(Ifeatures.deleteStore), val.deleteStoreVal, handler.deleteStoreHandler)
  .get(val.getStoreVal, handler.getStoreHandler)
  .patch(
    isAuthorized(Ifeatures.linkProductStore),
    val.addProductToStoreVal,
    handler.addProductToStoreHandler,
  );
