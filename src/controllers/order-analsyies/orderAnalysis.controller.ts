import 'express-async-errors';
import { Order } from '../../models/order.model';
import { OrderAnalysisHandler } from '../../types/endpoints/order-analysis.endpoint';
import { NotFoundError } from '../../utils/errors/notfound-error';
import { calculateUserCycleTime } from '../../utils/orderAnalysiz';

export const orderAnalysisHandler: OrderAnalysisHandler = async (req, res, next) => {
  const order = await Order.findById(req.params.orderId).populate({
    path: 'cartItems.product',
  });
  if (!order) return next(new NotFoundError('order not found'));

  const chefResult = calculateUserCycleTime(order.statusAt, '2', '3');

  const waiterResult = calculateUserCycleTime(order.statusAt, '3', '4');
  res
    .status(200)
    .json({ message: 'success', data: order, cheif: chefResult, waiter: waiterResult });
};
