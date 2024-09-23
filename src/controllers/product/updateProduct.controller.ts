import 'express-async-errors';
import { Catogry } from '../../models/catogry.model';
import { Product } from '../../models/product.model';
import { UpdateProductHandler } from '../../types/endpoints/product.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';
import { saveFiles, removeFiles } from '../../utils/file';

export const updateProductHandler: UpdateProductHandler = async (req, res, next) => {
  if (req.body.catogryId) {
    const catogry = await Catogry.findById(req.body.catogryId);
    if (!catogry) return next(new NotFoundError('catogry not found'));
  }

  req.body.extra = typeof req.body.extra == 'string' ? [] : req.body.extra;
  if (req.body.extra && req.body.extra.length > 0) {
    const extraProductsNotFound = [];

    for (const product of req.body.extra) {
      const foundProduct = await Product.findById(product);

      if (!foundProduct) {
        extraProductsNotFound.push(product);
      }
    }

    if (extraProductsNotFound.length > 0) {
      return next(new NotFoundError(`Products not found: ${extraProductsNotFound.join(', ')}`));
    }
  }
  console.log(req.body);

  const files = <{ image?: [Express.Multer.File] }>req.files || [];
  const image = files.image ? files.image[0] : undefined;
  const product = await Product.findByIdAndUpdate(req.params.productId, {
    ...req.body,
    [image ? 'image' : (null as any)]: `/media/images/${image?.filename}`,
  });

  if (!product) return next(new NotFoundError('product not found'));

  saveFiles('images', image ? image : undefined);
  removeFiles(image ? product.image : undefined);
  const updatedProduct = await Product.findById(req.params.productId);

  res.status(200).json({ message: 'success', data: updatedProduct! });
};
