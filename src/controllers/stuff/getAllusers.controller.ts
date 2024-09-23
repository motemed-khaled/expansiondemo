import 'express-async-errors';

import { User } from '../../models/stuff.model';
import { GetUsersHandler } from '../../types/endpoints/stuff.endpoint';
import { NotFoundError } from '../../utils/errors/notfound-error';

interface DateFilter {
  $gte?: Date;
  $lt?: Date;
}

export const getUsersHandler: GetUsersHandler = async (req, res, next) => {
  const { online, fromDate, toDate } = req.query;
  const matchQuery: any = {};

  if (online !== undefined) {
    matchQuery.online = JSON.parse(online) == true;
  }

  let dateFilter: DateFilter = {};

  if (!fromDate && !toDate) {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
      23,
      59,
      59,
      999,
    );
    dateFilter = {
      $gte: startOfDay,
      $lt: endOfDay,
    };
  }
  if (fromDate && toDate) {
    dateFilter = {
      $gte: new Date(fromDate),
      $lt: new Date(toDate),
    };
  }

  const usersWithConnectionTime = await User.aggregate([
    {
      $match: matchQuery,
    },
    {
      $lookup: {
        from: 'connectiontimes',
        let: { userId: '$_id' },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ['$user', '$$userId'] },
                  { $gte: ['$date', dateFilter.$gte] },
                  { $lte: ['$date', dateFilter.$lt] },
                ],
              },
            },
          },
          {
            $group: {
              _id: '$user',
              totalConnectionTime: { $sum: '$totalConnectionTime' },
            },
          },
        ],
        as: 'connectionTimes',
      },
    },
    {
      $addFields: {
        connectionTime: { $sum: '$connectionTimes.totalConnectionTime' },
      },
    },
    {
      $lookup: {
        from: 'types', // Replace 'types' with the actual collection name
        localField: 'typeId',
        foreignField: '_id',
        as: 'typeData',
      },
    },
    {
      $project: {
        id: '$_id',
        name: 1,
        email: 1,
        connectionTime: 1,
        salary: 1,
        _id: 0,
        typeData: 1, // Include typeData field to return all data in typeId
      },
    },
  ]);

  if (usersWithConnectionTime.length === 0) {
    return next(new NotFoundError('Users not found'));
  }

  res.status(200).json({ message: 'success', data: usersWithConnectionTime });
};
