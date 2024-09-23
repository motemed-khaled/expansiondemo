import mongoose from 'mongoose';

import { Istuff } from '../types/stuff';
import { hashPassword } from '../utils/bcrypt';

const stuffSchema = new mongoose.Schema<Istuff>(
  {
    email: {
      type: String,
      unique: true,
    },
    password: String,
    name: {
      type: String,
      trim: true,
    },
    typeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'types',
    },
    token: String,
    type: String,
    online: {
      type: Boolean,
      default: false,
    },
    orders: {
      type: Number,
      default: 0,
    },
    salary: Number,
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

stuffSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await hashPassword(this.password);
  next();
});

export const User = mongoose.model<Istuff>('stuff', stuffSchema);
