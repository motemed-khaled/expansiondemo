import mongoose from 'mongoose';

import { Irate } from '../types/rate';

const rateSchema = new mongoose.Schema<Irate>(
  {
    rate: {
      type: Number,
      default: 0,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customers',
    },
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

export const Rate = mongoose.model<Irate>('rates', rateSchema);
