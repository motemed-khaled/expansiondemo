import 'express-async-errors';

import { Store } from '../../models/store.model';
import { GetStoreHandler } from '../../types/endpoints/store.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getStoreHandler: GetStoreHandler = async (req, res, next) => {
  const store = await Store.findById(req.params.storeId).populate('products.product', 'name');
  if (!store) return next(new NotFoundError(`store not found ${req.params.storeId}`));
  res.status(200).json({ message: 'success', data: store });
};
