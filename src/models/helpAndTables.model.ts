import mongoose from 'mongoose';

import { Ihelp } from '../types/help';

const helpSchema = new mongoose.Schema<Ihelp>(
  {
    tableNum: String,
    tableStatus: {
      type: String,
      enum: ['ready', 'busy'],
      default: 'ready',
    },
    help: {
      type: Boolean,
      default: false,
    },
    cleanStatus: {
      type: Boolean,
      default: false,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'customers',
    },
    isRed: {
      type: Boolean,
      default: false,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'stuff',
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

export const Help = mongoose.model('helps', helpSchema);
