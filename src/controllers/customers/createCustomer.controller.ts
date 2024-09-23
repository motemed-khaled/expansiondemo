import 'express-async-errors';

import { Customer } from '../../models/customer.model';
import { CreateCustomerHandler } from '../../types/endpoints/customer.endpoints';


export const createCustomerHandler:CreateCustomerHandler = async (req,res)=>{
  const customer = await Customer.create(req.body);
  res.status(201).json({message:'success' , data:customer});
};