import 'express-async-errors';
import { RequestHandler } from 'express';
import mongoose from 'mongoose';

import { Customer } from '../../models/customer.model';
import { Order } from '../../models/order.model';
import { GetCustomersHandler } from '../../types/endpoints/customer.endpoints';




export const getCustomersForAdminPagination: RequestHandler<
  unknown,
  unknown,
  unknown,
  {
    phone?: string;
    name?: string;
    address?: string;
    typeId?: string;
    word?: string;
    toDate?:string;
    fromDate?:string;
  }
> = (req, res, next) => {
  req.pagination.filter ={};

  if (req.query.phone) {
    req.pagination.filter.phone = req.query.phone;
  }

  if (req.query.name) {
    req.pagination.filter.name = { $regex: `\\b${req.query.name}\\b`, $options: 'i' };
  }

  if (req.query.address) {
    req.pagination.filter['location.address'] = { $regex: `\\b${req.query.address}\\b`, $options: 'i' };
  }

  if (req.query.typeId) {
    req.pagination.filter.typeId = new mongoose.Types.ObjectId(req.query.typeId);
  }

  if (req.query.word) {
    req.pagination.filter.$or = [
      { phone: { $regex: `\\b${req.query.word}\\b`, $options: 'i' } },
      { name: { $regex: `\\b${req.query.word}\\b`, $options: 'i' } },
      { 'location.address': { $regex: `\\b${req.query.word}\\b`, $options: 'i' } },
    ];
  }

  if (req.query.fromDate || req.query.toDate) {
    req.pagination.filter.createdAt = {};
    if (req.query.fromDate) {
      req.pagination.filter.createdAt.$gte = new Date(req.query.fromDate as string);
    }
    if (req.query.toDate) {
      req.pagination.filter.createdAt.$lte = new Date(req.query.toDate as string);
    }
  }

  next();
};



export const getCustomersHandler: GetCustomersHandler = async (req, res) => {
  const customers = await Customer.find(req.pagination.filter).skip(req.pagination.skip).limit(req.pagination.limit);

  const orderCounts = await Order.aggregate([
    {
      $group: {
        _id: '$customer',
        totalOrders: { $sum: 1 },
      },
    },
  ]);

  const orderCountsMap = new Map<string, number>();
  orderCounts.forEach((count: any) => {
    orderCountsMap.set(count._id.toString(), count.totalOrders);
  });

  const customersWithOrderCount = customers.map((customer) => {
    const customerId = customer._id.toString();
    const orderCount = orderCountsMap.get(customerId) || 0;
    return {
      ...customer.toJSON(),
      orderCount,
    };
  });
  const resultCount = await Customer.countDocuments(req.pagination.filter);
  res.status(200).json({
    message:'success',
    pagination:{
      currentPage:req.pagination.page,
      resultCount,
      totalPages:Math.ceil(resultCount/req.pagination.limit)
    },
    data:customersWithOrderCount
  });
};
