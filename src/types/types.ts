import { Document, Types } from 'mongoose';

export interface Itype extends Document {
  key: string;
  roleId: Types.ObjectId;
}
