import { RequestHandler } from 'express';
import jwt from 'jsonwebtoken';

import { Customer } from '../models/customer.model';
import { Resturant as Restaurant } from '../models/resturant.model';
import { User } from '../models/stuff.model';
import { NotFoundError } from '../utils/errors/notfound-error';
import { UnauthorizedError } from '../utils/errors/un-authorizedError';
import { UnauthenticatedError } from '../utils/errors/unauthenticated-error';
import { IjwtPayload } from '../utils/generateToken';

export enum UserType {
  customer = 'customer',
  stuff = 'stuff',
}

export const isAuth = (whoAccess: string[]) => <RequestHandler>(async (req, res, next) => {
  const restaurant = await Restaurant.find().select('+plan');
  if (restaurant.length === 0) return next(new NotFoundError('restaurant not found'));
  if (!restaurant[0].plan.status)
    return next(new UnauthenticatedError('please update your plan to continue'));
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return next(new UnauthenticatedError());

  try {
    const payload = jwt.verify(token, process.env.JWT_KEY!) as IjwtPayload;

    if (payload.userType === 'admin') {
      req.loggedUser = { id: payload.id, type: payload.type, userType: payload.userType };
      return next();
    }

    if (!whoAccess.includes(payload.type)) return next(new UnauthorizedError());

    if (payload.type === UserType.customer) {
      const customer = await Customer.findOne({ token });

      if (!customer) return next(new UnauthenticatedError());
    }

    if (payload.type === UserType.stuff) {
      const user = await User.findOne({ token });
      if (!user) return next(new UnauthenticatedError());
    }

    req.loggedUser = { id: payload.id, type: payload.type, typeId: payload.typeId };

    return next();
  } catch (error) {
    throw new UnauthenticatedError('invalid or expired token');
  }
});
