import 'express-async-errors';

import { Customer } from '../../models/customer.model';
import { UpdateLocationHandler } from '../../types/endpoints/customer.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';


export const updateLocationHandler:UpdateLocationHandler = async (req,res,next)=>{
  const customer = await Customer.findById(req.params.customerId);
  if (!customer) 
    return next(new NotFoundError('customer not found'));

  const index = customer.location.findIndex((el:any)=>el._id.toString() === req.body.addressId);
  if (index === -1) 
    return next(new NotFoundError('address not found'));

  customer.location[index].address = req.body.address;
  await customer.save();
  res.status(200).json({message:'success' , data:customer});
    
};