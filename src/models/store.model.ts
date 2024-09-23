import mongoose from 'mongoose';

import { Istore } from '../types/store';

export const storeSchema = new mongoose.Schema<Istore>(
  {
    name: String,
    remainingPercentage: {
      type: Number,
      default: 100,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    measruingUnit: String,
    image: String,
    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
        },
        percent: {
          from: Number,
          to: Number,
        },
      },
    ],
  },
  { timestamps: true },
);

export const Store = mongoose.model<Istore>('store', storeSchema);
