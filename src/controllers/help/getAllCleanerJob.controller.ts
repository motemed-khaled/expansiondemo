import 'express-async-errors';
import { Help } from '../../models/helpAndTables.model';
import { GetAllCleanerJobHandler } from '../../types/endpoints/helpAndTables.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getAlCleanerJobHandler: GetAllCleanerJobHandler = async (req, res, next) => {
  const jobs = await Help.find({ cleanStatus: true, tableStatus: 'busy' });
  if (jobs.length === 0) return next(new NotFoundError('no jobs'));
  res.status(200).json({ message: 'success', data: jobs });
};
