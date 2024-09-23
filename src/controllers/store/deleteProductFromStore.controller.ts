import 'express-async-errors';

import { Store } from '../../models/store.model';
import { DeleteProductFromStoreHandler } from '../../types/endpoints/store.endpoints';
import { BadRequestError } from '../../utils/errors/bad-request-error';

export const deleteProductFromStoreHandler: DeleteProductFromStoreHandler = async (
  req,
  res,
  next,
) => {
  const { productId, storeId } = req.params;
  const updatedStore = await Store.findOneAndUpdate(
    { _id: storeId },
    { $pull: { products: { _id: productId } } },
    { new: true },
  );

  if (!updatedStore) return next(new BadRequestError(`can not update this store ${storeId}`));
  res.status(204).json({ message: 'success' });
};
