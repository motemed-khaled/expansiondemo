import 'express-async-errors';
import { Catogry } from '../../models/catogry.model';
import { CreateCatogryHandler } from '../../types/endpoints/category.endpoints';
import { BadRequestError } from '../../utils/errors/bad-request-error';

export const createCatogryHandler: CreateCatogryHandler = async (req, res, next) => {
  const catogry = await Catogry.create(req.body);
  if (!catogry) return next(new BadRequestError('failed to create catogry'));
  res.status(200).json({ message: 'success', data: catogry });
};
