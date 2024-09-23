import 'express-async-errors';
import { Invoice } from '../../models/invoice.model';
import { Order } from '../../models/order.model';
import { CreateInvoiceHandler } from '../../types/endpoints/invoice.endpoints';
import { BadRequestError } from '../../utils/errors/bad-request-error';

export const createInvoiceHandler: CreateInvoiceHandler = async (req, res, next) => {
  const {invoiceNum,processNum} = req.body;
  const ordersCount = await Order.countDocuments({ _id: req.body.orders.map((el) => el) });
  if (ordersCount != req.body.orders.length) return next(new BadRequestError('invalid orders'));

  for (const order of req.body.orders) {
    await Order.findByIdAndUpdate(order, { $set: { invoiceNum, processNum } });
  }
  
  const invoice = await Invoice.create({ ...req.body, user: req.loggedUser?.id });
  if (!invoice) return next(new BadRequestError('failed to create this invoice'));

  res.status(200).json({ message: 'success' });
};
