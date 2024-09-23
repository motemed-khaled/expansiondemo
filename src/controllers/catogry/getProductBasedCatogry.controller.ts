import 'express-async-errors';
import { Product } from '../../models/product.model';
import { GetProductBasedCatogryHandler } from '../../types/endpoints/category.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getProductBasedOnCatogryHandler: GetProductBasedCatogryHandler = async (
  req,
  res,
  next,
) => {
  const products = await Product.find({ catogryId: req.params.catogryId }).populate('extra');
  if (products.length === 0)
    return next(new NotFoundError(`this catogry : ${req.params.catogryId} dont have product`));
  res.status(200).json({ message: 'success', data: products });
};
