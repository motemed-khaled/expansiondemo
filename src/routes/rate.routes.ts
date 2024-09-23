import express from 'express';

import * as handler from '../controllers';
import { UserType, isAuth } from '../guards/IsAuth.guard';
import * as val from '../validators/rate.val';

export const router = express.Router();

router.post('/', isAuth([UserType.customer]), val.createRouteVal, handler.createRateHandler);
