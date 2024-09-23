import mongoose from 'mongoose';

import { Icustomer } from '../types/customer';

const customerSchema = new mongoose.Schema<Icustomer>(
  {
    phone: {
      type: String,
      unique:true
    },
    name:{type:String , default:null},
    location:[{address:{type:String , default:null}}],
    token: String,
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'types',
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

export const Customer = mongoose.model<Icustomer>('customers', customerSchema);
