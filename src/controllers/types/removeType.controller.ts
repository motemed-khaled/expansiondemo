import 'express-async-errors';
import { Type } from '../../models/types.model';
import { RemoveTypeHandler } from '../../types/endpoints/types.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const removeTypesHandler: RemoveTypeHandler = async (req, res, next) => {
  const type = await Type.findByIdAndDelete(req.params.typeId);
  if (!type) return next(new NotFoundError('type not found'));
  res.status(204).json({ message: 'success' });
};
