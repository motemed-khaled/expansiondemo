import 'express-async-errors';
import { Catogry } from '../../models/catogry.model';
import { Product } from '../../models/product.model';
import { CreateProductHandler } from '../../types/endpoints/product.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';
import { saveFiles } from '../../utils/file';

export const createProductHandler: CreateProductHandler = async (req, res, next) => {
  const catogry = await Catogry.findById(req.body.catogryId);
  if (!catogry) return next(new NotFoundError('catogry not found'));
  console.log(req.body.extra);
  
  if (req.body.extra && req.body.catogryId.toString() != '65ff30670d16ea01b7d57739') {
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

  if (req.body.catogryId.toString() == '65ff30670d16ea01b7d57739') req.body.extra = undefined;

  const files = <{ image?: [Express.Multer.File] }>req.files;
  const image = files.image ? files.image[0] : undefined;
  
  const product = await Product.create({
    ...req.body,
    [image ? 'image' : (null as any)]: `/media/images/${image?.filename}`,
  });
  saveFiles('images', image);
  res.status(201).json({ message: 'success', data: product });
};
