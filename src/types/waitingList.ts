import { Document } from 'mongoose';

export interface IwaitingList extends Document {
  name: string;
  phone: string;
  waitingNumber: number;
  team: number;
}
