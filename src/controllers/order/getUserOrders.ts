import 'express-async-errors';
import { Order } from '../../models/order.model';
import { GetUserOrdersHandler } from '../../types/endpoints/order.endpoint';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getUserOrdersHandler: GetUserOrdersHandler = async (req, res, next) => {
  const orders = await Order.find({ customer: req.loggedUser?.id, isPaid: false }).populate({
    path: 'cartItems.product cartItems.extra',
    populate: {
      path: 'extra',
    },
  });
  if (orders.length === 0) return next(new NotFoundError('user dont have orders'));
  res.status(200).json({ message: 'success', data: orders });
};
