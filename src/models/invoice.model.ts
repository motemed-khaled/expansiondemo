import { Schema, model } from 'mongoose';

import { Iinvoice } from '../types/invoice';
import { PaymentMethod } from '../types/order';

export const Invoice = model<Iinvoice>(
  'invoice',
  new Schema<Iinvoice>(
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: 'stuff',
      },
      orders: [{ type: Schema.Types.ObjectId, ref: 'orders' }],
      invoiceNum: String,
      paymentMethod: {
        type: String,
        enum: Object.values(PaymentMethod),
      },
      totalPrice: Number,
      processNum: String,
    },
    { timestamps: true, collection: 'invoice' },
  ),
);
