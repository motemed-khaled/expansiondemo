import 'express-async-errors';

import { env } from '../../config/env';
import { Resturant } from '../../models/resturant.model';
import { PlanControlHandler } from '../../types/endpoints/resturant.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';
import { UnauthorizedError } from '../../utils/errors/un-authorizedError';




export const planControlHandler:PlanControlHandler = async (req,res,next)=>{

  if (env.key.apiKey != req.headers.apikey)
    return next(new UnauthorizedError('you not allowed access this route'));


  const restaurant = await Resturant.find().select('+plan');
  if (restaurant.length === 0 ) 
    return next(new NotFoundError('restaurant not found'));

  restaurant[0].plan.status = !restaurant[0].plan.status;

  await restaurant[0].save();
  res.status(200).json({message:'success' , data:{status:restaurant[0].plan.status}});
};
