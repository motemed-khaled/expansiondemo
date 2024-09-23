import mongoose from 'mongoose';

import { Itype } from '../types/types';

const typeSchema = new mongoose.Schema<Itype>(
  {
    key: {
      type: String,
      unique: true,
    },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'roles',
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

export const Type = mongoose.model<Itype>('types', typeSchema);
