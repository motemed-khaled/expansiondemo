import 'express-async-errors';
import { Help } from '../../models/helpAndTables.model';
import { GetHelpsHandler } from '../../types/endpoints/helpAndTables.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getHelpsHandler: GetHelpsHandler = async (req, res, next) => {
  const helps = await Help.find({ help: true }).populate([{ path: 'user', select: 'name' }]);
  if (helps.length === 0) return next(new NotFoundError('helps not found'));
  res.status(200).json({ message: 'success', data: helps });
};
