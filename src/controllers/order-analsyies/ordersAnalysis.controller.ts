import 'express-async-errors';
import { Order } from '../../models/order.model';
import { AllOrderAnalysisHandler } from '../../types/endpoints/order-analysis.endpoint';
import { CalculateOrdersPrice } from '../../utils/calcOrdersPrice';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const allOrderAnalysisHandler: AllOrderAnalysisHandler = async (req, res, next) => {
  const fromDate = new Date(req.query.from);
  const toDate = req.query.to ? new Date(req.query.to) : new Date();
  toDate.setHours(23, 59, 59, 999);
  const filter: any = {
    createdAt: {
      $gte: fromDate,
      $lte: toDate,
    },
  };
  if (req.query.paymentMethod) filter['paymentMethodType'] = req.query.paymentMethod;
  
  if (req.query.isPaid) filter['isPaid'] = req.query.isPaid=='true'?true:false;

  const orders = await Order.find(filter).populate('customer');
  if (orders.length === 0) return next(new NotFoundError('Orders not found'));

  const ordersPrice: number = CalculateOrdersPrice(orders);
  
  const totalCustomers = await Order.aggregate([
    { $match: filter },
    { $group: { _id: '$customer' } }, // Group by customer
    { $count: 'totalCustomers' } // Count the distinct customers
  ]);

  const customersCount = totalCustomers.length > 0 ? totalCustomers[0].totalCustomers : 0;

  res.status(200).json({
    message: 'success',
    data: orders,
    totalOrdersPrice: ordersPrice,
    customers: customersCount,
    ordersCount: orders.length,
  });
};

