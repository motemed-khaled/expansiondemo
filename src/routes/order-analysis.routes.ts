import express from 'express';

import * as handler from '../controllers';
import { UserType, isAuth } from '../guards/IsAuth.guard';
import * as val from '../validators/orderAnalysis.val';

export const router = express.Router();
router.use(isAuth([UserType.stuff]));
router.route('/').get(val.ordersAalysisVal, handler.allOrderAnalysisHandler);
router.get('/allorder', handler.allOrderHandler);
router.get('/month', handler.getAllOrderByMonthHandler);
router.get('/:orderId', handler.orderAnalysisHandler);
