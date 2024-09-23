import 'express-async-errors';

import { Slider } from '../../models/slider.model';
import { GetSliderHandler } from '../../types/endpoints/slider.endpoints';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getSliderHandler: GetSliderHandler = async (req, res, next) => {
  const sliders = await Slider.find();
  if (sliders.length === 0) return next(new NotFoundError('slider not found'));
  res.status(200).json({ message: 'success', data: sliders[0] });
};
