import { Document, Types } from 'mongoose';

export interface Istuff extends Document {
  email: string;
  password: string;
  name: string;
  typeId: Types.ObjectId;
  token: string | undefined;
  type: string;
  online: boolean;
  orders: number;
  salary: number;
}
