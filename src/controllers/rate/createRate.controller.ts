import 'express-async-errors';
import { Rate } from '../../models/rate.model';
import { Resturant } from '../../models/resturant.model';
import { CreateRateHandler } from '../../types/endpoints/rate.endpoints';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { NotFoundError } from '../../utils/errors/notfound-error';
import { ServerError } from '../../utils/errors/server-error';
import { UnauthorizedError } from '../../utils/errors/un-authorizedError';

export const createRateHandler: CreateRateHandler = async (req, res, next) => {
  if (req.loggedUser?.userType === 'admin')
    return next(new UnauthorizedError('you not allow to access this route'));

  const existRate = await Rate.findOne({ customer: req.loggedUser?.id });
  if (existRate) return next(new BadRequestError('you already have a rate'));

  const rate = await Rate.create({
    rate: req.body.rate,
    customer: req.loggedUser?.id,
  });

  if (!rate) return next(new ServerError('failed to create rate'));

  const resturant = await Resturant.find();
  if (resturant.length === 0) return next(new NotFoundError('resturant not found'));

  resturant[0].rate = (resturant[0].rate + req.body.rate) / (resturant[0].rateQuantity + 1);
  resturant[0].rateQuantity++;
  resturant[0].save();

  res.status(201).json({ message: 'success' });
};
