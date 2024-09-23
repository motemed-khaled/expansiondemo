import 'express-async-errors';

import { Job } from '../../models/jobs.model';
import { GetUserJobHandler } from '../../types/endpoints/job.controller';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const getUserJobHandler: GetUserJobHandler = async (req, res, next) => {
  const jobs = await Job.findOne({ user: req.loggedUser?.id }).populate({
    path: 'orders',
    populate: {
      path: 'cartItems.product cartItems.extra',
      populate: {
        path: 'extra',
      },
    },
  });
  if (!jobs) return next(new NotFoundError('user dont have jobs'));
  if (jobs.orders.length == 0) return next(new NotFoundError('user dont have jobs'));
  res.status(200).json(<any>{ message: 'success', data: jobs.orders });
};
