import 'express-async-errors';

import { Slider } from '../../models/slider.model';
import { UpdateSliderHandler } from '../../types/endpoints/slider.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';
import { removeFiles, saveFiles } from '../../utils/file';

export const updateSliderHandler: UpdateSliderHandler = async (req, res, next) => {
  const oldImages: string[] = req.body.currentImages || [];

  const sliders = await Slider.find();
  if (sliders.length === 0) return next(new NotFoundError('slider not found'));
  const slider = sliders[0];

  const files = <{ images?: [Express.Multer.File] }>req.files || [];
  const filesImages = files.images ? files.images : [];
  let images: string[] = [];
  if (filesImages.length != 0) {
    images = filesImages.map((file) => `/media/images/${file.filename}`);
  }
  if (oldImages.length > 0 && filesImages.length == 0) {
    oldImages.forEach((image) => {
      if (slider.images.includes(image)) removeFiles(image ? image : undefined);
    });
    slider.images = slider.images.filter((ele) => !oldImages.includes(ele));
    const post = await slider.save();
    return res.status(200).json({ message: 'success', data: post });
  }
  if (oldImages.length > 0) {
    oldImages.forEach((image) => {
      removeFiles(image ? image : undefined);
    });
  }

  if (filesImages.length > 0) {
    filesImages.forEach((image) => {
      saveFiles('images', image ? image : undefined);
    });
    slider.images = [...slider.images, ...images];
    slider.images = slider.images.filter((ele) => !oldImages.includes(ele));
    const post = await slider.save();
    return res.status(200).json({ message: 'success', data: post });
  }
  res.status(200).json({ message: 'success', data: slider });
};
