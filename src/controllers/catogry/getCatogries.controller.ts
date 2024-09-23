import 'express-async-errors';
import { Catogry } from '../../models/catogry.model';
import { GetCatogriesHandler } from '../../types/endpoints/category.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getCatogriesHandler: GetCatogriesHandler = async (req, res, next) => {
  const catogries = await Catogry.find();
  if (catogries.length === 0) return next(new NotFoundError('catogries not found'));

  res.status(200).json({ message: 'success', data: catogries });
};
