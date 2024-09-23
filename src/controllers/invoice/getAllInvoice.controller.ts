import 'express-async-errors';

import { Invoice } from '../../models/invoice.model';
import { GetAllInvoiceHandler } from '../../types/endpoints/invoice.endpoints';

export const getAllInvoiceHandler: GetAllInvoiceHandler = async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const skip = (Number(page) - 1) * Number(limit);
  const filter: any = {};

  if (req.query.paymentMethod) {
    filter.paymentMethod = req.query.paymentMethod;
  }

  if (req.query.from && req.query.to) {
    filter.createdAt = {
      $gte: new Date(req.query.from),
      $lte: new Date(req.query.to),
    };
  }

  if (req.query.orderId) filter.orders = { $in: [req.query.orderId] };

  const invoices = await Invoice.find(filter)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip)
    .populate({
      path: 'orders',
      populate: [
        { path: 'cartItems.product', model: 'products' },
        { path: 'cartItems.extra', model: 'products' },
        { path: 'customer', model: 'customers' },
      ],
    })
    .populate({ path: 'user', select: 'name' });

  const totalPrice = await Invoice.aggregate([
    { $match: filter },
    { $group: { _id: null, totalPrice: { $sum: '$totalPrice' } } },
  ]);

  const totalInvoicePrice = totalPrice.length > 0 ? totalPrice[0].totalPrice : 0;
  const totalInvoices = await Invoice.countDocuments();

  res.status(200).json({ message: 'success', data: invoices, totalInvoicePrice, totalInvoices });
};
