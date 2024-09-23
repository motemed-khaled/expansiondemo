import { Document, Types } from 'mongoose';

export interface Icustomer extends Document {
  id: string;
  name:string;
  location:[{address:string}]
  phone: string;
  token: string;
  typeId: Types.ObjectId;
}
