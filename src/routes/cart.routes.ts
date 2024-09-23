import express from 'express';

import * as handler from '../controllers/index';
import { isAuth, UserType } from '../guards/IsAuth.guard';
import * as val from '../validators/cart.val';

export const router = express.Router();

router
  .route('/')
  .post(isAuth([UserType.customer]), val.addToCartVal, handler.addToCartHandler)
  .get(isAuth([UserType.customer]), handler.getLoggedUserCartHandler)
  .delete(isAuth([UserType.customer]), handler.removeUserCartHandler);

router
  .route('/:itemId')
  .delete(isAuth([UserType.customer]), val.removeItemFromCartVal, handler.removeItemFromCartHandler)
  .put(
    isAuth([UserType.customer]),
    val.updateCartItemQuantity,
    handler.updateCartItemQuantityHandler,
  );
