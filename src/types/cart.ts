import { Document, Types } from 'mongoose';

import { Iproduct } from './product';
export interface Icart extends Document {
  customer: Types.ObjectId;
  cartItems: [
    {
      id?: string;
      extra: Types.ObjectId[];
      product: Types.ObjectId;
      quantity: number;
      price: number;
    },
  ];
  totalPrice: number;
}

export interface IcartItem {
  id?: string;
  product: Iproduct;
  quantity: number;
  price: number;
}
