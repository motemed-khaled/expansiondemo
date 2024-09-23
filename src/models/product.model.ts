import mongoose, { Schema } from 'mongoose';

import { Iproduct } from '../types/product';

const productSchema = new mongoose.Schema<Iproduct>(
  {
    name: {
      type: String,
      trim: true,
    },
    price: String,
    desc: {
      type: String,
      trim: true,
    },
    calories: String,
    catogryId: {
      type: Schema.Types.ObjectId,
      ref: 'catogries',
    },
    image: {
      type: String,
      default: '',
    },
    status: {
      type: Boolean,
      default: true,
    },
    extra: [
      {
        type: Schema.Types.ObjectId,
        ref: 'products',
      },
    ],
  },
  {
    timestamps: true,
  },
);

export const Product = mongoose.model<Iproduct>('products', productSchema);
