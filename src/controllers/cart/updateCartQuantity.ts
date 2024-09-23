import 'express-async-errors';
import { Cart } from '../../models/cart.model';
import { UpdateCartItemQuantityHandler } from '../../types/endpoints/cart.endpoints';
import { calcTotalPrice } from '../../utils/calcCartPrice';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const updateCartItemQuantityHandler: UpdateCartItemQuantityHandler = async (
  req,
  res,
  next,
) => {
  const cart = await Cart.findOne({ customer: req.loggedUser?.id });
  if (!cart) return next(new NotFoundError('user dont have cart'));

  const cartItemIndex = cart.cartItems.findIndex((el) => el.id === req.params.itemId);

  if (cartItemIndex > -1) cart.cartItems[cartItemIndex].quantity = req.body.quantity;
  else return next(new BadRequestError(`no cart item in this id : ${req.params.itemId}`));

  cart.totalPrice = calcTotalPrice(cart);
  cart.cartItems.sort((a, b) => new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime());

  await cart.save();
  res.status(200).json({ message: 'success', data: cart });
};
