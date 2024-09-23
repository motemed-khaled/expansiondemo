import 'express-async-errors';
import { Type } from '../../models/types.model';
import { GetTypesHandler } from '../../types/endpoints/types.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getTypesHandler: GetTypesHandler = async (req, res, next) => {
  const types = await Type.find();
  if (types.length === 0) return next(new NotFoundError('types not found'));
  res.status(200).json({ message: 'success', data: types });
};
