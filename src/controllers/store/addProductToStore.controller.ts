import 'express-async-errors';
import { Product } from '../../models/product.model';
import { Store } from '../../models/store.model';
import { AddProductToStoreHandler } from '../../types/endpoints/store.endpoints';
import { checkProductStock } from '../../utils/calcStore';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const addProductToStoreHandler: AddProductToStoreHandler = async (req, res, next) => {
  const { storeId } = req.params;

  const product = await Product.findById(req.body.product);
  if (!product) return next(new NotFoundError(`product not found ${req.body.product}`));
  const foundProduct = await Store.findOne({ _id: storeId, 'products.product': req.body.product });
  if (foundProduct)
    return next(new BadRequestError(`product alredy link with this store ${req.body.product}`));
  const updatedStore = await Store.findByIdAndUpdate(
    storeId,
    { $push: { products: req.body } },
    { new: true },
  )
    .populate('products.product', 'name')
    .lean();
  if (!updatedStore) return next(new BadRequestError(`can not update this store ${storeId}`));
  //check stock for this product
  await checkProductStock(updatedStore, req.body.product);
  res.status(200).json({ message: 'success', data: updatedStore });
};
