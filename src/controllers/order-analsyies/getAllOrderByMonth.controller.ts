import 'express-async-errors';

import { Order } from '../../models/order.model';
import { GetAllOrderByMonthHandler } from '../../types/endpoints/order-analysis.endpoint';

export const getAllOrderByMonthHandler: GetAllOrderByMonthHandler = async (req, res) => {
  const result = await Order.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },
    {
      $group: {
        _id: {
          year: { $year: '$createdAt' },
          month: { $month: '$createdAt' },
        },
        totalOrders: { $sum: 1 },
        totalPrice: { $sum: '$totalOrderPrice' },
      },
    },
    {
      $project: {
        _id: 0,
        year: '$_id.year',
        month: '$_id.month',
        totalOrders: 1,
        totalPrice: 1,
      },
    },
    {
      $sort: { year: 1, month: 1 },
    },
  ]);
  res.status(200).json({ message: 'success', data: result });
};
