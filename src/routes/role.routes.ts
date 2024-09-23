import express from 'express';

import { isAuthorized } from './../guards/isAuthorized.guard';
import * as handler from '../controllers';
import { UserType, isAuth } from '../guards/IsAuth.guard';
import { Ifeatures } from '../types/features';
import * as val from '../validators/role.val';

export const router = express.Router();

router.get(
  '/permission',
  isAuth([UserType.stuff]),
  isAuthorized(Ifeatures.getAllPermissionHandler),
  handler.getAllPermissionHandler,
);

router
  .route('/')
  .post(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.createRoleHandler),
    val.createRoleVal,
    handler.createRoleHandler,
  )
  .get(isAuth([UserType.stuff]), isAuthorized(Ifeatures.getRolesHandler), handler.getRolesHandler);

router
  .route('/:roleId')
  .get(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.getRoleHandler),
    val.getRoleVal,
    handler.getRoleHandler,
  )
  .put(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.updateRoleHandler),
    val.updateRoleVal,
    handler.updateRoleHandler,
  )
  .delete(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.removeRoleHandler),
    val.removeRoleVal,
    handler.removeRoleHandler,
  );
