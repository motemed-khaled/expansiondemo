import express from 'express';

import * as handler from '../controllers/index';
import { isAuth, UserType } from '../guards/IsAuth.guard';
import { isAuthorized } from '../guards/isAuthorized.guard';
import { Ifeatures } from '../types/features';
import * as val from '../validators/order.val';

export const router = express.Router();

router.get('/jobs', isAuth([UserType.stuff]), handler.getUserJobHandler);
router.put(
  '/customer/orderpayment',
  isAuth([UserType.customer]),
  val.updateAllUserOrderPaymentVal,
  handler.updateAllUserOrderPaymentHandler,
);
router.get(
  '/customer/:customerId',
  isAuth([UserType.stuff]),
  val.getUserTotalOrderVal,
  handler.getTotalUserOrderHandler,
);
router.post(
  '/cashier-order',
  isAuth([UserType.stuff]),
  val.createCashierOrderVal,
  handler.createCashierOrderHandler,
);
router.put(
  '/payment/:OrderId',
  isAuth([UserType.customer]),
  val.updatePaymentOrderVal,
  handler.updateOrderPaymentHandler,
);
router.get('/customer', isAuth([UserType.customer]), handler.getUserOrdersHandler);
router.put(
  '/:orderId/status',
  isAuth([UserType.stuff]),
  isAuthorized(Ifeatures.updateOrderStatusHandler),
  val.updateOrderStatusVal,
  handler.updateOrderStatusHandler,
);
router.put(
  '/update-order/:orderId',
  isAuth([UserType.stuff]),
  isAuthorized(Ifeatures.updateOrderHandler),
  val.updateOrderVal,
  handler.updateOrderHandler,
);

router
  .route('/')
  .post(isAuth([UserType.customer]), val.craeteOrderVal, handler.createCashOrderHandler)
  .get(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.getAllOrderHandler),
    val.getAllOrderVal,
    handler.getAllOrderHandler,
  );

router
  .route('/:orderId')
  .put(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.updateIsPaidHandler),
    val.updateIsPaidHandler,
    handler.updateIsPaidHandler,
  )
  .get(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.getSpecificOrderHandler),
    val.getSpecificOrderVal,
    handler.getSpecificOrderHandler,
  )
  .delete(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.removeOrderHandler),
    val.removeOrderVal,
    handler.removeOrderHandler,
  );
