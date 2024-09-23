import 'express-async-errors';
import { User } from '../../models/stuff.model';
import { UserLoginHandler } from '../../types/endpoints/stuff.endpoint';
import { comparePassword } from '../../utils/bcrypt';
import { UnauthenticatedError } from '../../utils/errors/unauthenticated-error';
import { generateToken } from '../../utils/generateToken';

export const userLoginHandler: UserLoginHandler = async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) return next(new UnauthenticatedError('invalid creditional'));
  if (!(await comparePassword(req.body.password, user.password)))
    return next(new UnauthenticatedError('invalid creditional'));
  let token: string;
  if (user.type)
    token = generateToken({
      id: user.id,
      type: 'stuff',
      userType: user.type,
    });
  else token = generateToken({ id: user.id, type: 'stuff', typeId: user.typeId.toString() });
  user.token = token;
  await user.save();
  user.password = '';
  res.status(200).json({ message: 'success', data: (user as any)._doc });
};
