import 'express-async-errors';
import { Invoice } from '../../models/invoice.model';
import { DeleteInvoiceHandler } from '../../types/endpoints/invoice.endpoints';

export const deleteInvoiceHandler: DeleteInvoiceHandler = async (req, res) => {
  await Invoice.findByIdAndDelete(req.params.invoiceId);
  res.status(204).json({ message: 'success' });
};
