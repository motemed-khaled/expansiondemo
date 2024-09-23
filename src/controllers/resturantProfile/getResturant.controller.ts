import 'express-async-errors';
import { Resturant } from '../../models/resturant.model';
import { GetResturantHandler } from '../../types/endpoints/resturant.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getResturantHandler: GetResturantHandler = async (req, res, next) => {
  const profile = await Resturant.find();
  

  if (profile.length === 0) return next(new NotFoundError('profile not found'));

  res.status(200).json({ message: 'success', data: profile });
};
