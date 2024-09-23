import 'express-async-errors';
import { Waiting } from '../../models/waiting.model';
import { CreateWaitingListHandler } from '../../types/endpoints/waiting.endpoints';
import { ServerError } from '../../utils/errors/server-error';

export const createWaitingListHandler: CreateWaitingListHandler = async (req, res, next) => {
  const wait = await Waiting.create(req.body);
  if (!wait) return next(new ServerError('failed to create wait'));
  res.status(200).json({ message: 'success', data: wait });
};
