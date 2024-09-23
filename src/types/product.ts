import { Document, Types } from 'mongoose';

export interface Iproduct extends Document {
  id: string;
  name: string;
  desc: string;
  price: string;
  image: string;
  calories: string;
  catogryId: Types.ObjectId;
  status: boolean;
  extra: Types.ObjectId[] | undefined;
}
