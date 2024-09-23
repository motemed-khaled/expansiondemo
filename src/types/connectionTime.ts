import { Document, Types } from 'mongoose';

export interface IconnectionTime extends Document {
  user: Types.ObjectId;
  date: Date;
  totalConnectionTime: number;
}
