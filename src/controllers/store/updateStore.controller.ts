import 'express-async-errors';

import { Product } from '../../models/product.model';
import { Store } from '../../models/store.model';
import { UpdateStoreHandler } from '../../types/endpoints/store.endpoints';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { removeFiles, saveFiles } from '../../utils/file';

export const updateStoreHandler: UpdateStoreHandler = async (req, res, next) => {
  const { storeId } = req.params;
  const { quantity, disQuantity } = req.body;
  if (req.body.image) delete req.body.image;
  if (req.body.quantity) delete req.body.quantity;
  if (req.body.disQuantity) delete req.body.disQuantity;

  const store = await Store.findByIdAndUpdate(req.params.storeId, req.body, { new: true }).populate(
    'products.product',
    'name',
  );
  if (!store) return next(new BadRequestError(`can not update this store ${storeId}`));

  if (quantity) {
    const recentQuantity = store.quantity * (store.remainingPercentage / 100);
    store.quantity = recentQuantity + +quantity;
    store.remainingPercentage = 100;
  }

  if (disQuantity) {
    const recentQuantity = store.quantity * (store.remainingPercentage / 100);
    if (recentQuantity < +disQuantity)
      return next(new BadRequestError(`rescent quantity less than this quantity ${disQuantity}`));
    store.quantity = recentQuantity - +disQuantity;
    store.remainingPercentage = 100;
  }

  const files = <{ image?: [Express.Multer.File] }>req.files || [];

  const updatedImage = files.image ? files.image[0] : undefined;

  if (updatedImage) {
    saveFiles('images', updatedImage ? updatedImage : undefined);

    removeFiles(store.image ? store.image : undefined);
    store.image = `/media/images/${updatedImage.filename}`;
  }

  if (quantity || disQuantity) {
    if (store.products.length > 0) {
      store.products.forEach(async (p) => {
        const decreaseAmount = p?.percent.to / p?.percent.from;
        const availableStore = (store.remainingPercentage / 100) * store.quantity;
        const product = await Product.findById(p.product);
        if (availableStore < decreaseAmount) {
          if (product && product.status !== undefined) {
            product.status = false;
          }
        } else {
          if (product && product.status !== undefined) {
            product.status = true;
          }
        }
        await product?.save();
      });
    }
  }
  await store.save();
  res.status(200).json({ message: 'success', data: store });
};
