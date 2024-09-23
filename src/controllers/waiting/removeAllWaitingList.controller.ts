import 'express-async-errors';

import { Waiting } from '../../models/waiting.model';
import { DeleteAllWaitingListHandler } from '../../types/endpoints/waiting.endpoints';

export const deleteAllWaitingListHandler: DeleteAllWaitingListHandler = async (req, res) => {
  await Waiting.deleteMany({});
  res.status(204).json({ message: 'success' });
};
