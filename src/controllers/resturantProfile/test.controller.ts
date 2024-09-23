import 'express-async-errors';
import { TestApp } from '../../types/endpoints/resturant.endpoints';

export const testApp: TestApp = async (req, res) => {
  res.status(200).json({ message: 'success', data: true });
};
