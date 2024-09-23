import 'express-async-errors';
import { Customer } from '../../models/customer.model';
import { SignupCustomerHandler } from '../../types/endpoints/customer.endpoints';
import { SystemRole } from '../../types/systemRole';
import { generateToken } from '../../utils/generateToken';

export const signUpHandler: SignupCustomerHandler = async (req, res) => {
  let customer = await Customer.findOne({ phone: req.body.phone });
  if (!customer) {
    customer = await Customer.create({ ...req.body, typeId: SystemRole.customer });
  }
  const token = generateToken({
    id: customer.id,
    type: 'customer',
    typeId: customer.typeId.toString(),
  });
  customer.token = token;
  await customer.save();
  return res.status(201).json({ message: 'success', data: customer, token });
};
