import 'express-async-errors';

import { Customer } from '../../models/customer.model';
import { UpdateCustomerHandler } from '../../types/endpoints/customer.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';



export const updateCustomerHandler:UpdateCustomerHandler = async (req,res,next)=>{
  const newCustomer = await Customer.findByIdAndUpdate(req.params.customerId , req.body , {new:true , runValidators:true});
  if (!newCustomer) 
    return next(new NotFoundError('customer not found'));

  res.status(200).json({message:'success' , data:newCustomer});
};