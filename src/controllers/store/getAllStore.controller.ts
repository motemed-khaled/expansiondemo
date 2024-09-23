import 'express-async-errors';

import { Store } from '../../models/store.model';
import { GetStoresHandler } from '../../types/endpoints/store.endpoints';

export const getStoresHandler: GetStoresHandler = async (req, res) => {
  const limit = req.query.limit || 10;
  const page = req.query.page || 1;
  const skip = (Number(page) - 1) * Number(limit);
  let query = {};

  if (req.query.name) {
    query = { name: { $regex: req.query.name, $options: 'i' } };
  }
  const stores = await Store.find(query)
    .limit(limit)
    .skip(skip)
    .lean()
    .populate('products.product', 'name');

  res.status(200).json({ message: 'success', data: stores });
};
