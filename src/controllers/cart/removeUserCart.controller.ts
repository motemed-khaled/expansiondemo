import 'express-async-errors';
import { Cart } from '../../models/cart.model';
import { RemoveUserCartHandler } from '../../types/endpoints/cart.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const removeUserCartHandler: RemoveUserCartHandler = async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ customer: req.loggedUser?.id });

  if (!cart) return next(new NotFoundError('user dont have cart'));
  res.status(204).json({ message: 'success' });
};
