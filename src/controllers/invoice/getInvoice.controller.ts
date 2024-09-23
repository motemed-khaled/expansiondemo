import 'express-async-errors';
import { Invoice } from '../../models/invoice.model';
import { GetInvoiceHandler } from '../../types/endpoints/invoice.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getInvoiceHandler: GetInvoiceHandler = async (req, res, next) => {
  const invoice = await Invoice.findById(req.params.invoiceId)
    .populate({
      path: 'orders',
      populate: {
        path: 'cartItems.product',
        model: 'products',
      },
    })
    .populate({
      path: 'orders',
      populate: {
        path: 'cartItems.extra',
        model: 'products',
      },
    })
    .populate({ path: 'user', select: 'name' });

  if (!invoice) return next(new NotFoundError('invoice not found'));

  res.status(200).json({ message: 'success', data: invoice });
};
