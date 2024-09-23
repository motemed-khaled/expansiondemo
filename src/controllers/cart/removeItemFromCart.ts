import 'express-async-errors';
import { Cart } from '../../models/cart.model';
import { RemoveItemFromCartHandler } from '../../types/endpoints/cart.endpoints';
import { calcTotalPrice } from '../../utils/calcCartPrice';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const removeItemFromCartHandler: RemoveItemFromCartHandler = async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { customer: req.loggedUser?.id },
    {
      $pull: { cartItems: { _id: req.params.itemId } },
    },
    { new: true },
  );

  if (!cart) return next(new NotFoundError('user dont have cart'));
  cart.totalPrice = calcTotalPrice(cart);
  cart.cartItems.sort((a, b) => new Date((b as any).createdAt).getTime() - new Date((a as any).createdAt).getTime());
  await cart.save();
  res.status(200).json({ message: 'success', data: cart });
};
