import express from 'express';

import { isAuthorized } from './../guards/isAuthorized.guard';
import * as handler from '../controllers';
import { UserType, isAuth } from '../guards/IsAuth.guard';
import { Ifeatures } from '../types/features';
import * as val from '../validators/type.val';

export const router = express.Router();

router
  .route('/')
  .post(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.createTypeHandler),
    val.createTypeVal,
    handler.createTypeHandler,
  )
  .get(isAuth([UserType.stuff]), isAuthorized(Ifeatures.getTypesHandler), handler.getTypesHandler);

router
  .route('/:typeId')
  .get(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.getTypeHandler),
    val.getTypeVal,
    handler.getTypeHandler,
  )
  .put(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.updateTypeHandler),
    val.updateTypeVal,
    handler.updateTypeHandler,
  )
  .delete(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.removeTypesHandler),
    val.removeTypeVal,
    handler.removeTypesHandler,
  );
