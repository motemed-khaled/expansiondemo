import { Document, Types } from 'mongoose';

import { Iorder } from './order';
import { Istuff } from './stuff';

export interface Iinvoice extends Document {
  user: Types.ObjectId | Istuff;
  orders: Types.ObjectId[] | Iorder[];
  paymentMethod: 'نقدى' | 'شبكة' | 'بطاقة ائتمانية';
  totalPrice: number;
  invoiceNum: string;
  processNum: string;
}
