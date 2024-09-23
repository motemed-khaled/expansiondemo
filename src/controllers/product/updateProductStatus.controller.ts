import 'express-async-errors';

import { Product } from '../../models/product.model';
import { UpdateProductStatusHandler } from '../../types/endpoints/product.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const updateProductStatusHandler: UpdateProductStatusHandler = async (req, res, next) => {
  const product = await Product.findById(req.params.productId);
  if (!product) return next(new NotFoundError('product not found'));
  product.status = !product.status;
  await product.save();
  res.status(200).json({ message: 'success', data: product });
};
