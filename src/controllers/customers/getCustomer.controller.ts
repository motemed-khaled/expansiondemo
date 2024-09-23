import 'express-async-errors';
import { Customer } from '../../models/customer.model';
import { GetCustomerHandler } from '../../types/endpoints/customer.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getCustomerHandler: GetCustomerHandler = async (req, res, next) => {
  const customer = await Customer.findById(req.params.customerId);
  if (!customer) return next(new NotFoundError('customer not found'));
  res.status(200).json({ message: 'success', data: customer });
};
