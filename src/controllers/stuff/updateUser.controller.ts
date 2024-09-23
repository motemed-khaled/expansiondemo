import 'express-async-errors';
import { Resturant } from '../../models/resturant.model';
import { User } from '../../models/stuff.model';
import { Type } from '../../models/types.model';
import { UpdateUserHandler } from '../../types/endpoints/stuff.endpoint';
import { hashPassword } from '../../utils/bcrypt';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { NotFoundError } from '../../utils/errors/notfound-error';
import { UnauthorizedError } from '../../utils/errors/un-authorizedError';

export const updateUserHandler: UpdateUserHandler = async (req, res, next) => {

  type PlanKey = 'chief' | 'waiter' | 'cashier' | 'cleaner';

  const currentUser = await User.findById(req.params.userId);
  if (!currentUser) 
    return next(new NotFoundError('user not found'));

  // update type
  if (req.body.typeId && currentUser.typeId != req.body.typeId) {
    const restaurant = await Resturant.find();
    if (restaurant.length === 0 ) 
      return next(new NotFoundError('restaurant not found'));

    const type = await Type.findById(req.body.typeId);
    if (!type) return next(new BadRequestError('type not found'));

    const users = await User.find({typeId:req.body.typeId}).countDocuments();
    
    if (users >= restaurant[0].plan[`${type.key as PlanKey}`])
      return next(new UnauthorizedError(`You have reached the maximum number of users you can create for the type '${type.key}'.`));
  }

  // update password
  if (req.body.password) req.body.password = await hashPassword(req.body.password);
  const user = await User.findByIdAndUpdate(req.params.userId, req.body, { new: true });

  if (!user) return next(new NotFoundError('user not found'));

  res.status(200).json({
    message: 'success',
    data: { email: user.email, name: user.name, typeId: user.typeId, token: user.token },
  });
};
