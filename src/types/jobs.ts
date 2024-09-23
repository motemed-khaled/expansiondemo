import { Document, Types } from 'mongoose';

export interface Ijob extends Document {
  user: Types.ObjectId;
  type: string;
  orders: Types.ObjectId[];
}
