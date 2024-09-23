import { Document } from 'mongoose';

export interface Islider extends Document {
  images: string[];
}
