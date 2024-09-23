import { Document, Types } from 'mongoose';

export interface Irate extends Document {
  customer: Types.ObjectId;
  rate: number;
}
