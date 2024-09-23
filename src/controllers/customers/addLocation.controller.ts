import 'express-async-errors';

import { Customer } from '../../models/customer.model';
import { AddLocationHandler } from '../../types/endpoints/customer.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';



export const addLocationHandler:AddLocationHandler = async (req,res,next)=>{
  const updatedCustomer = await Customer.findByIdAndUpdate(
    req.params.customerId,
    { $push: { location: { address: req.body.address } } },
    { new: true, runValidators: true }
  );

  if (!updatedCustomer) 
    return next(new NotFoundError('customer not found'));

  res.status(200).json({message:'success' , data:updatedCustomer});
};