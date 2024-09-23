import 'express-async-errors';
import { Product } from '../../models/product.model';
import { GetProductHandler } from '../../types/endpoints/product.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getProductHandler: GetProductHandler = async (req, res, next) => {
  const product = await Product.findById(req.params.productId).populate('extra');

  if (!product) return next(new NotFoundError('product not found'));
  res.status(200).json({ message: 'success', data: product });
};
