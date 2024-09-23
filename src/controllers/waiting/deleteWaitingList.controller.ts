import 'express-async-errors';
import { Waiting } from '../../models/waiting.model';
import { DeleteWaitingListHandler } from '../../types/endpoints/waiting.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const deleteWaitingListHandler: DeleteWaitingListHandler = async (req, res, next) => {
  const waiting = await Waiting.findByIdAndDelete(req.params.waitingId);
  if (!waiting) return next(new NotFoundError('waiting not found'));
  res.status(204).json({ message: 'success' });
};
