import 'express-async-errors';

import { Product } from '../../models/product.model';
import { Store } from '../../models/store.model';
import { DeleteStoreHandler } from '../../types/endpoints/store.endpoints';
import { BadRequestError } from '../../utils/errors/bad-request-error';

export const deleteStoreHandler: DeleteStoreHandler = async (req, res, next) => {
  const store = await Store.findByIdAndDelete(req.params.storeId);
  if (!store) return next(new BadRequestError(`can not delete this store ${req.params.storeId}`));
  if (store.products.length > 0) {
    store.products.forEach(async (p) => {
      const decreaseAmount = p.percent.to / p.percent.from;
      const availableStore = (store.remainingPercentage / 100) * store.quantity;
      if (availableStore < decreaseAmount)
        await Product.findByIdAndUpdate(p.product, { status: true });
    });
  }
  res.status(204).json({ message: 'success' });
};
