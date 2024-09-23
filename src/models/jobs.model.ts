import mongoose from 'mongoose';

import { Ijob } from '../types/jobs';

export const jobsSchema = new mongoose.Schema<Ijob>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stuff',
    },
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'orders',
      },
    ],
    type: String,
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

export const Job = mongoose.model<Ijob>('jobs', jobsSchema);
