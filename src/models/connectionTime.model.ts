import mongoose from 'mongoose';

import { IconnectionTime } from '../types/connectionTime';

const connectionTimeSchema = new mongoose.Schema<IconnectionTime>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stuff',
    },
    date: { type: Date, required: true },
    totalConnectionTime: { type: Number, default: 0 },
  },
  { timestamps: true },
);

export const ConnectionTime = mongoose.model<IconnectionTime>(
  'connectionTime',
  connectionTimeSchema,
);
