import express from 'express';

import * as handler from '../controllers';
import { isAuth, UserType } from '../guards/IsAuth.guard';
import { globalUploadMiddleware } from '../middlewares/global-upload.middleware';
import * as val from '../validators/slider.val';

export const router = express.Router();
router
  .route('/')
  .put(
    isAuth([UserType.stuff]),
    globalUploadMiddleware({ fileType: 'image' }).fields([{ name: 'images', maxCount: 10 }]),
    val.updateSliderVal,
    handler.updateSliderHandler,
  )
  .get(handler.getSliderHandler);
