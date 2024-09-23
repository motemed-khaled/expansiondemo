import 'express-async-errors';
import { Resturant } from '../../models/resturant.model';
import { CreateResturantHandler } from '../../types/endpoints/resturant.endpoints';

export const createResturantHandler: CreateResturantHandler = async (req, res) => {
  await Resturant.create(req.body);
  res.status(201).json({ message: 'success' });
};
