import 'express-async-errors';

import { Order } from '../../models/order.model';
import { GetTotalUserOrderHandler } from '../../types/endpoints/order.endpoint';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getTotalUserOrderHandler: GetTotalUserOrderHandler = async (req, res, next) => {
  const orders = await Order.find({ customer: req.loggedUser?.id, isPaid: false });
  if (orders.length === 0) return next(new NotFoundError('user dont have orders'));
  let total = 0;
  orders.forEach((ele) => {
    total += ele.totalOrderPrice;
  });

  res.status(200).json({ message: 'success', data: { totalPrice: total } });
};
