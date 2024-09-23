import 'express-async-errors';
import { Resturant } from '../../models/resturant.model';
import { User } from '../../models/stuff.model';
import { Type } from '../../models/types.model';
import { CreateUserHandler } from '../../types/endpoints/stuff.endpoint';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { NotFoundError } from '../../utils/errors/notfound-error';
import { ServerError } from '../../utils/errors/server-error';
import { UnauthorizedError } from '../../utils/errors/un-authorizedError';

export const createUserHandler: CreateUserHandler = async (req, res, next) => {

  type PlanKey = 'chief' | 'waiter' | 'cashier' | 'cleaner';

  const restaurant = await Resturant.find();
  if (restaurant.length === 0) 
    return next(new NotFoundError('restaurant not found'));

  const type = await Type.findById(req.body.typeId);
  if (!type) return next(new BadRequestError('type not found'));
  
  const users = await User.find({typeId:req.body.typeId}).countDocuments();

  if (users >= restaurant[0].plan[`${type.key as PlanKey}`]) 
    return next(new UnauthorizedError(`You have reached the maximum number of users you can create for the type '${type.key}'.`));

  const user = await User.create(req.body);
  if (!user) return next(new ServerError('failed to create user'));
  res.status(201).json({
    message: 'success',
    data: {
      email: user.email,
      name: user.name,
      typeId: user.typeId,
      token: user.token,
      salary: user.salary,
    },
  });
};
