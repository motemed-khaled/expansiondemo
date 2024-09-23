import 'express-async-errors';
import { Store } from '../../models/store.model';
import { CreateStoreHandler } from '../../types/endpoints/store.endpoints';
import { saveFiles } from '../../utils/file';

export const createStoreHandler: CreateStoreHandler = async (req, res) => {
  const files = <{ image?: [Express.Multer.File] }>req.files || [];
  const image = files.image ? files.image[0] : undefined;
  const store = await Store.create({
    ...req.body,
    [image ? 'image' : (null as any)]: `/media/images/${image?.filename}`,
  });
  saveFiles('images', image ? image : undefined);
  res.status(201).json({ message: 'success', data: store });
};
