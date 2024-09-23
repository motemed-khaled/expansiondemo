import 'express-async-errors';
import { Waiting } from '../../models/waiting.model';
import { GetAllWatingListHandler } from '../../types/endpoints/waiting.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getAllWaitingListHandler: GetAllWatingListHandler = async (req, res, next) => {
  const waitings = await Waiting.find({});
  if (waitings.length === 0) return next(new NotFoundError('no waiting list'));
  res.status(200).json({ message: 'success', data: waitings });
};
