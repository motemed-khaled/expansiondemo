import mongoose from 'mongoose';

import { IwaitingList } from '../types/waitingList';

const waitingSchema = new mongoose.Schema<IwaitingList>(
  {
    name: {
      type: String,
      trim: true,
    },
    phone: String,
    waitingNumber: {
      type: Number,
      default: 0,
    },
    team: Number,
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

waitingSchema.pre<IwaitingList>('save', async function (next) {
  const highestWaitingNumber = await Waiting.findOne().sort('-waitingNumber').exec();

  const nextWaitingNumber = highestWaitingNumber ? highestWaitingNumber.waitingNumber + 1 : 1;

  this.waitingNumber = nextWaitingNumber;

  next();
});

export const Waiting = mongoose.model<IwaitingList>('wating', waitingSchema);
