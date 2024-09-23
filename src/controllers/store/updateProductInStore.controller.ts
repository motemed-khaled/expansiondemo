import 'express-async-errors';

import { Product } from '../../models/product.model';
import { Store } from '../../models/store.model';
import { UpdateProductInStoreHandler } from '../../types/endpoints/store.endpoints';
import { checkProductStock } from '../../utils/calcStore';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const updateProductInStoreHandler: UpdateProductInStoreHandler = async (req, res, next) => {
  const { productId, storeId } = req.params;
  const { percent, product } = req.body;
  const recentProduct = await Product.findById(product);
  if (!recentProduct) return next(new NotFoundError(`product not found ${product}`));
  const updatedStore = await Store.findOneAndUpdate(
    { _id: storeId, 'products._id': productId },
    { $set: { 'products.$.product': product, 'products.$.percent': percent } },
    { new: true },
  )
    .populate('products.product', 'name')
    .lean();
  if (!updatedStore) return next(new BadRequestError(`failed to update this store ${productId}`));
  //check stock for this product
  await checkProductStock(updatedStore, req.body.product);
  res.status(200).json({ message: 'success', data: updatedStore });
};
