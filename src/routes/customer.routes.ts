import express from 'express';

import * as handler from '../controllers/index';
import { UserType, isAuth } from '../guards/IsAuth.guard';
import { isAuthorized } from '../guards/isAuthorized.guard';
import { globalPaginationMiddleware } from '../middlewares/globalPagination.middleware';
import { Ifeatures } from '../types/features';
import * as val from '../validators/customer.val';

export const router = express.Router();

router.get('/loggedcustomer', isAuth([UserType.customer]), handler.getLoggedCustomerHandler);
router
  .route('/')
  .post(val.SignUpVal, handler.signUpHandler)
  .get(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.getCustomersHandler),
    globalPaginationMiddleware,
    val.validateCustomerQueries,
    handler.getCustomersForAdminPagination,
    handler.getCustomersHandler,
  );

router.route('/stuff')
  .post(isAuth([UserType.stuff]) , val.createCustomerVal , handler.createCustomerHandler);

router.route('/stuff/:customerId')
  .all(isAuth([UserType.stuff]))
  .post( val.addLocationVal , handler.addLocationHandler)
  .put( val.updateCustomerVal , handler.updateCustomerHandler)
  .patch(val.updateLocationVal , handler.updateLocationHandler)
  .delete(val.deleteLocationVal , handler.deleteLocationHandler);

router
  .route('/:customerId')
  .get(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.getCustomerHandler),
    val.getCustomerVal,
    handler.getCustomerHandler,
  )
  .delete(
    isAuth([UserType.stuff]),
    isAuthorized(Ifeatures.deleteCustomerHandler),
    val.deleteCustomerVal,
    handler.deleteCustomerHandler,
  );
