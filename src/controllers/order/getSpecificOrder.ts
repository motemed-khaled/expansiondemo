import 'express-async-errors';
import { Order } from '../../models/order.model';
import { GetSpecificOrderHandler } from '../../types/endpoints/order.endpoint';
import { NotFoundError } from '../../utils/errors/notfound-error';
import { UnauthorizedError } from '../../utils/errors/un-authorizedError';

export const getSpecificOrderHandler: GetSpecificOrderHandler = async (req, res, next) => {
  const order = await Order.findById(req.params.orderId)
    .populate({
      path: 'cartItems.product cartItems.extra',
      populate: {
        path: 'extra',
      },
    })
    .populate([{ path: 'user', select: 'name' }]);

  if (!order) return next(new NotFoundError('order not found'));

  if (order.customer.toString() != req.loggedUser?.id)
    return next(new UnauthorizedError('user not owner for this product'));

  res.status(200).json({ message: 'success', data: order });
};
