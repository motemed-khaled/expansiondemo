import express from 'express';

import * as handler from '../controllers';
import { UserType, isAuth } from '../guards/IsAuth.guard';
import * as val from '../validators/waiting.val';

export const router = express.Router();

router.use(isAuth([UserType.stuff]));
router
  .route('/')
  .post(val.createWaitingVal, handler.createWaitingListHandler)
  .get(handler.getAllWaitingListHandler)
  .delete(isAuth([UserType.stuff]), handler.deleteAllWaitingListHandler);

router.delete('/:waitingId', val.deleteWaitingVal, handler.deleteWaitingListHandler);
