import jwt from 'jsonwebtoken';

import { env } from '../config/env';

export interface IjwtPayload {
  id: string;
  type: string;
  typeId?: string;
  userType?: string;
}

export interface Ipagination {
  limit: number;
  skip: number;
  page: number;
  filter: any;
}
export const generateToken = (option: IjwtPayload) => {
  return jwt.sign(option, env.jwt.secret);
};
