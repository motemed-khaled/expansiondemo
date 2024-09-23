import 'express-async-errors';
import { Catogry } from '../../models/catogry.model';
import { GetCatogryHandler } from '../../types/endpoints/category.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getCatogryHandler: GetCatogryHandler = async (req, res, next) => {
  const catogry = await Catogry.findById(req.params.catogryId);

  if (!catogry) return next(new NotFoundError('catogry not found'));
  res.status(200).json({ message: 'success', data: catogry });
};
