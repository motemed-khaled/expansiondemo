import { Types, Document } from 'mongoose';

import { Istuff } from './stuff';

export enum PaymentMethod {
  Cash = 'نقدى',
  Network = 'شبكة',
  CreditCard = 'بطاقة ائتمانية',
}

export interface Iorder extends Document {
  user: Types.ObjectId | Istuff | string;
  customer: Types.ObjectId;
  cartItems: [
    {
      id?: string;
      product: Types.ObjectId;
      quantity: number;
      price: number;
      extra?: Types.ObjectId[] | undefined;
    },
  ];
  totalOrderPrice: number;
  paymentMethodType: string;
  isPaid: boolean;
  paidAt: Date;
  orderStatus: string;
  tableNum: number;
  description: string;
  shippingPrice: number;
  stuff?: Types.ObjectId;
  orderNum: number;
  statusAt: [
    {
      orderStatus: string;
      createdAt: Date;
    },
  ];
  isWatchied: boolean;
  isRed: boolean;
  operationNumber: number | undefined;
  TakeAway: boolean;
  invoiceNum: string;
  processNum: string;
}
