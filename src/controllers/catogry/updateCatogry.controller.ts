import 'express-async-errors';
import { Catogry } from '../../models/catogry.model';
import { UpdateCategoryHandler } from '../../types/endpoints/category.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const updateCatogryHandler: UpdateCategoryHandler = async (req, res, next) => {
  const catogry = await Catogry.findByIdAndUpdate(req.params.catogryId, req.body, { new: true });

  if (!catogry) return next(new NotFoundError('catogry not found'));

  res.status(200).json({ message: 'success', data: catogry });
};
