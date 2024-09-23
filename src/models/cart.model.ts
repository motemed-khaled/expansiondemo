import mongoose from 'mongoose';

import { Icart } from '../types/cart';

const cartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'products',
    },
    extra: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'products',
      },
    ],
    quantity: {
      type: Number,
      default: 1,
    },
    price: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

const cartSchema = new mongoose.Schema<Icart>(
  {
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customers',
    },
    cartItems: [cartItemSchema],
    totalPrice: Number,
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

export const Cart = mongoose.model<Icart>('Cart', cartSchema);
