import 'express-async-errors';
import { Help } from '../../models/helpAndTables.model';
import { Job } from '../../models/jobs.model';
import { Order } from '../../models/order.model';
import { User } from '../../models/stuff.model';
import { UpdateTableStatusHandler } from '../../types/endpoints/helpAndTables.endpoints';
import { SystemRole } from '../../types/systemRole';
import { NotFoundError } from '../../utils/errors/notfound-error';

export const updateTableStatusHandler: UpdateTableStatusHandler = async (req, res, next) => {
  const help = await Help.findOneAndUpdate(
    { tableNum: req.body.tableNum },
    { tableStatus: 'ready', cleanStatus: false, customerId: null },
    { new: true },
  );

  if (!help) return next(new NotFoundError('table not found'));
  const lastOrder = await Order.findOneAndUpdate(
    { tableNum: req.body.tableNum, user: req.loggedUser?.id },
    { user: null },
  );

  const cleanerJob = await Job.findOneAndUpdate(
    { type: SystemRole.cleaner, orders: lastOrder?.id },
    { $pull: { orders: lastOrder?.id } },
  );

  await User.findOneAndUpdate(
    { _id: cleanerJob?.user, orders: { $gte: 1 } },
    { $inc: { orders: -1 } },
    { new: true }
  );

  res.status(200).json({ message: 'success', data: help });
};
