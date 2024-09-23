import 'express-async-errors';
import { Catogry } from '../../models/catogry.model';
import { Product } from '../../models/product.model';
import { DeleteCatogryHandler } from '../../types/endpoints/category.endpoints';
import { UnauthorizedError } from '../../utils/errors/un-authorizedError';

export const deleteCatogryHandler: DeleteCatogryHandler = async (req, res, next) => {
  await Product.deleteMany({ catogryId: req.params.catogryId });
  if (req.params.catogryId === '65ff30670d16ea01b7d57739')
    return next(new UnauthorizedError('you cant delete this category'));
  await Catogry.findByIdAndDelete(req.params.catogryId);
  res.status(204).json({ message: 'success' });
};
