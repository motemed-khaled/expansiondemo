import 'express-async-errors';
import { Customer } from '../../models/customer.model';
import { DeleteCustomerHandler } from '../../types/endpoints/customer.endpoints';

export const deleteCustomerHandler: DeleteCustomerHandler = async (req, res) => {
  await Customer.findByIdAndDelete(req.params.customerId);
  res.status(204).json({ message: 'success' });
};
