import 'express-async-errors';
import { Product } from '../../models/product.model';
import { DeleteProductHandler } from '../../types/endpoints/product.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const deleteProductHandler: DeleteProductHandler = async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.productId).populate('extra');
  if (!product) return next(new NotFoundError('product not found'));
  res.status(204).json({ message: 'success' });
};
