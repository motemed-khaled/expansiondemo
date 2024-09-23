import 'express-async-errors';
import { Type } from '../../models/types.model';
import { GetTypeHandler } from '../../types/endpoints/types.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getTypeHandler: GetTypeHandler = async (req, res, next) => {
  const type = await Type.findById(req.params.typeId);
  if (!type) return next(new NotFoundError('type not found'));
  res.status(200).json({ message: 'success', data: type });
};
