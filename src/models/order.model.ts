import moment from 'moment';
import mongoose from 'mongoose';

import { Iorder, PaymentMethod } from '../types/order';

const orderSchema = new mongoose.Schema<Iorder>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stuff',
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customers',
    },
    cartItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
        },
        price: Number,
        quantity: Number,
        extra: [
          {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'products',
          },
        ],
      },
    ],
    totalOrderPrice: Number,
    paymentMethodType: {
      type: String,
      enum: Object.values(PaymentMethod),
      default: 'نقدى',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
    orderStatus: {
      type: String,
      enum: ['1', '2', '3', '4'],
      default: '1',
    },
    tableNum: Number,
    description: String,
    shippingPrice: Number,
    stuff: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stuff',
    },
    orderNum: {
      type: Number,
      default: 0,
    },
    statusAt: [
      {
        orderStatus: String,
        createdAt: Date,
      },
    ],
    isWatchied: {
      type: Boolean,
      default: false,
    },
    isRed: {
      type: Boolean,
      default: false,
    },
    operationNumber: Number,
    TakeAway: {
      type: Boolean,
      default: false,
    },
    invoiceNum:String,
    processNum:String
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

orderSchema.pre<Iorder>('save', async function(next) {
  if (!this.isNew) {
    return next();
  }

  const today = moment().startOf('day');
  const latestOrder = await Order.findOne({}, {}, { sort: { createdAt: -1 } });

  if (latestOrder) {
    const latestOrderDate = moment((latestOrder as any).createdAt).startOf('day');
    if (today.isSame(latestOrderDate)) {
      this.orderNum = latestOrder.orderNum + 1;
    } else {
      this.orderNum = 1;
    }
  } else {
    this.orderNum = 1;
  }

  next();
});

export const Order = mongoose.model<Iorder>('orders', orderSchema);
