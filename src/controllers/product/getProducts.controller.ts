import 'express-async-errors';
import { Product } from '../../models/product.model';
import { GetProductsHandler } from '../../types/endpoints/product.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getProductsHandler: GetProductsHandler = async (req, res, next) => {
  const products = await Product.find().populate('catogryId extra');
  if (products.length === 0) return next(new NotFoundError('products not found'));
  res.status(200).json({ message: 'success', data: products });
};
