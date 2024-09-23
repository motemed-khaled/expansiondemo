import express from 'express';

import * as handler from '../controllers';
import { UserType, isAuth } from '../guards/IsAuth.guard';
import { isAuthorized } from '../guards/isAuthorized.guard';
import { Ifeatures } from '../types/features';
import * as val from '../validators/help.val';

export const router = express.Router();

router.put(
  '/status',
  isAuth([UserType.stuff]),
  val.updateTableStatusVal,
  handler.updateTableStatusHandler,
);
router.get('/jobs', isAuth([UserType.stuff]), handler.getAlCleanerJobHandler);
router.get('/tables', isAuth([UserType.stuff]), handler.getAllTablesHandler);
router.post('/tables', isAuth([UserType.stuff]), val.addTablesVal, handler.addTableHandler);
router
  .route('/')
  .post(isAuth([UserType.customer]), val.createHelpVal, handler.createHelpHandler)
  .get(isAuth([UserType.stuff]), isAuthorized(Ifeatures.getHelpsHandler), handler.getHelpsHandler);

router
  .route('/:helpId')
  .put(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.responseHelpHandler),
    val.responseHelpVal,
    handler.responseHelpController,
  )
  .get(isAuth([UserType.stuff]), val.getHelpHandlerVal, handler.getSpecificHelpHandler)
  .delete(
    isAuth([UserType.stuff]),
    val.removeHelpHandlerVal,
    isAuthorized(Ifeatures.removeHelpHandler),
    handler.removeHelpHandler,
  );
