import 'express-async-errors';
import { Order } from '../../models/order.model';
import { RemoveOrderHandler } from '../../types/endpoints/order.endpoint';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const removeOrderHandler: RemoveOrderHandler = async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.orderId);
  if (!order) return next(new NotFoundError('order not found'));
  res.status(200).json({ message: 'success' });
};
