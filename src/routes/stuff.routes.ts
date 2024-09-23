import express from 'express';

import * as handler from '../controllers';
import { UserType, isAuth } from '../guards/IsAuth.guard';
import { isAuthorized } from '../guards/isAuthorized.guard';
import { Ifeatures } from '../types/features';
import * as val from '../validators/stuff.val';

export const router = express.Router();

router.post('/login', val.userLoginValidation, handler.userLoginHandler);

router.use(isAuth([UserType.stuff]));
router.put('/logout/:userId', val.userLoggedOutVal, handler.userLoggedOutHandler);
router.get('/loggeduser', handler.getLoggedUserHandler);
router
  .route('/')
  .post(isAuthorized(Ifeatures.createUserHandler), val.createUserVal, handler.createUserHandler)
  .get(isAuthorized(Ifeatures.getUsersHandler), val.getAllUsersVal, handler.getUsersHandler);

router
  .route('/:userId')
  .put(isAuthorized(Ifeatures.updateUserHandler), val.updateUserVal, handler.updateUserHandler)
  .get(isAuthorized(Ifeatures.getUserHandler), val.getUserVal, handler.getUserHandler)
  .delete(isAuthorized(Ifeatures.removeUserHandler), val.removeUserVal, handler.removeUserHandler);
