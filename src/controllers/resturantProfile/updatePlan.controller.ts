import 'express-async-errors';
import { env } from '../../config/env';
import { Resturant as Restaurant } from '../../models/resturant.model';
import { UpdatePlanHandler } from '../../types/endpoints/resturant.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';
import { UnauthorizedError } from '../../utils/errors/un-authorizedError';

export const updatePlanHandler: UpdatePlanHandler = async (req, res, next) => {
  if (env.key.apiKey != req.headers.apikey)
    return next(new UnauthorizedError('you not allowed access this route'));
  const restaurant = await Restaurant.find().select('+plan');
  
  if (restaurant.length === 0) return next(new NotFoundError('restaurant not found'));
  restaurant[0].plan.status = req.body.status ;
  restaurant[0].plan.chief = req.body.chief ;
  restaurant[0].plan.waiter = req.body.waiter ;
  restaurant[0].plan.cashier = req.body.cashier ;
  restaurant[0].plan.cleaner = req.body.cleaner ;
  restaurant[0].plan.whatsAppService = req.body.whatsAppService?req.body.whatsAppService:restaurant[0].plan.whatsAppService;
  await restaurant[0].save();

  res.status(200).json({ message: 'success', data: restaurant[0] });
};
