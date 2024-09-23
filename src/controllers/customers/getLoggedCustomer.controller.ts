import 'express-async-errors';
import { Customer } from '../../models/customer.model';
import { GetLoggedCustomerHandler } from '../../types/endpoints/customer.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getLoggedCustomerHandler: GetLoggedCustomerHandler = async (req, res, next) => {
  const customer = await Customer.findById(req.loggedUser?.id);
  if (!customer) {
    return next(new NotFoundError('customer not found'));
  }
  res.status(200).json({ message: 'success', data: customer });
};
