import { Document, Types } from 'mongoose';

export interface Istore extends Document {
  id: string;
  name: string;
  remainingPercentage: number;
  quantity: number;
  measruingUnit: string;
  image: string;
  products: [
    {
      product: Types.ObjectId;
      percent: {
        from: number;
        to: number;
      };
    },
  ];
}
