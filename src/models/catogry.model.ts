import mongoose from 'mongoose';

import { Icatogry } from '../types/catogry';

const catogrySchema = new mongoose.Schema<Icatogry>(
  {
    name: {
      type: String,
      trim: true,
    },
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
  },
);

export const Catogry = mongoose.model<Icatogry>('catogries', catogrySchema);
