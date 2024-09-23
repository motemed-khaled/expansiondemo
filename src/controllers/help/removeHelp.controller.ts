import 'express-async-errors';
import { Help } from '../../models/helpAndTables.model';
import { RemoveHelpHandler } from '../../types/endpoints/helpAndTables.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const removeHelpHandler: RemoveHelpHandler = async (req, res, next) => {
  const help = await Help.findByIdAndDelete(req.params.helpId);
  if (!help) return next(new NotFoundError('help not found'));
  res.status(204).json({ message: 'success' });
};
