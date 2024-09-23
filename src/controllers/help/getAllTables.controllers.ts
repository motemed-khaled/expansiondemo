import { Help } from '../../models/helpAndTables.model';
import { GetAllTablesHandler } from '../../types/endpoints/helpAndTables.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getAllTablesHandler: GetAllTablesHandler = async (req, res, next) => {
  let query = {};
  if (req.query.status) query = { tableStatus: req.query.status };
  const tables = await Help.find(query);
  if (tables.length == 0) return next(new NotFoundError('tables not found'));
  res.status(200).json({ message: 'success', data: tables });
};
