import { Document, Types } from 'mongoose';

import { Istuff } from './stuff';

export interface Ihelp extends Document {
  tableNum: number;
  tableStatus: string;
  help: boolean;
  cleanStatus: boolean;
  customerId: Types.ObjectId;
  isRed: boolean;
  user: Types.ObjectId | Istuff;
}
