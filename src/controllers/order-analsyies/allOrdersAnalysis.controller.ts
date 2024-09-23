import 'express-async-errors';
import { Order } from '../../models/order.model';
import { GetAllOrderTotalPriceHandler } from '../../types/endpoints/order-analysis.endpoint';

export const allOrderHandler: GetAllOrderTotalPriceHandler = async (req, res) => {
  const totalPaidAmount = await Order.aggregate([
    {
      $match: {
        isPaid: true,
      },
    },
    {
      $group: {
        _id: null,
        totalAmount: { $sum: '$totalOrderPrice' },
        customerIds: { $addToSet: '$customer' },
      },
    },
    {
      $project: {
        totalAmount: 1,
        customerCount: { $size: '$customerIds' },
      },
    },
  ]);

  const result =
    totalPaidAmount.length > 0 ? totalPaidAmount[0] : { totalAmount: 0, customerCount: 0 };
  const { totalAmount, customerCount } = result;

  const ordersCount = await Order.countDocuments();

  res.status(200).json({
    message: 'success',
    data: { totalOrders: totalAmount, customer: customerCount, ordersCount },
  });
};
