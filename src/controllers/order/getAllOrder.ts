import 'express-async-errors';
import moment from 'moment';

import { Order } from '../../models/order.model';
import { GetAllOrderHandler } from '../../types/endpoints/order.endpoint';
import { NotFoundError } from '../../utils/errors/notfound-error';
export const getAllOrderHandler: GetAllOrderHandler = async (req, res, next) => {
  let orders;
  const query: { isPaid?: boolean; tableNum?: number; createdAt?: { $gte: Date; $lte: Date } } = {};
  const limit: number = req.query.limit || 10;
  const page: number = req.query.page || 1;
  const skip: number = (page - 1) * limit;

  if (req.query.isPaid) query.isPaid = req.query.isPaid;
  if (req.query.tableNum) query.tableNum = +req.query.tableNum;
  if (req.query.startDate && req.query.endDate) {
    const startDate = moment(req.query.startDate).startOf('day').toDate();
    const endDate = moment(req.query.endDate).endOf('day').toDate();
    query.createdAt = { $gte: startDate, $lte: endDate };
  }

  if (!req.body.orderStatus) {
    orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate({
        path: 'cartItems.product cartItems.extra',
        populate: {
          path: 'extra',
        },
      })
      .populate([{ path: 'customer' }, { path: 'user', select: 'name' }]);
  } else {
    orders = await Order.find({ orderStatus: { $in: req.body.orderStatus } })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate({
        path: 'cartItems.product cartItems.extra',
        populate: {
          path: 'extra',
        },
      })
      .populate([{ path: 'customer' }, { path: 'user', select: 'name' }]);
  }

  const documentNumber = await Order.find(query).countDocuments();

  if (orders.length === 0) return next(new NotFoundError('orders not found'));
  res.status(200).json({ message: 'success', data: orders, total: documentNumber });
};
