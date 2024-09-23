import mongoose from 'mongoose';

import { Irole } from '../types/roles';

const permissionSchema = new mongoose.Schema<Irole>(
  {
    key: {
      type: String,
      unique: true,
    },
    permission: {
      type: [String],
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

export const Role = mongoose.model<Irole>('roles', permissionSchema);
