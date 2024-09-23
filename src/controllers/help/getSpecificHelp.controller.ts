import 'express-async-errors';
import { Help } from '../../models/helpAndTables.model';
import { GetHelpHandler } from '../../types/endpoints/helpAndTables.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getSpecificHelpHandler: GetHelpHandler = async (req, res, next) => {
  const help = await Help.findOne({ id: req.params.helpId, help: true });
  if (!help) return next(new NotFoundError('help not found'));
  res.status(200).json({ message: 'success', data: help });
};
