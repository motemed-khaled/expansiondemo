import mongoose from 'mongoose';

import { IresturantProfile } from '../types/resturant';

const resturantSchema = new mongoose.Schema<IresturantProfile>(
  {
    name: {
      type: String,
      trim: true,
      default: 'resturant',
    },
    profileCover: {
      type: String,
      default: '',
    },
    imageProfile: {
      type: String,
      default: '',
    },
    socialMediaLinks: [
      {
        link: String,
        icon: String,
      },
    ],
    rate: {
      type: Number,
      default: 0,
    },
    rateQuantity: {
      type: Number,
      default: 0,
    },
    shippingPrice: {
      type: Number,
      default: 0,
    },
    plan: {
      status:{type:Boolean , default:false},
      cashier:{type:Number , default:0},
      waiter:{type:Number , default:0},
      chief:{type:Number , default:0},
      cleaner:{type:Number , default:0},
      whatsAppService:{type:Boolean , default:false}
    },
    currency: String,
    location: String,
    waiterAlert: Number,
    cheifAlert: Number,
    TaxNumber: {
      type: String,
      unique: true,
    },
    CommercialRecord: {
      type: String,
      unique: true,
    },
    qrCodeLink: String,
    orgnizationName: String,
    branchName: String,
    twilioNumber:{type:String , select:false},
    twilioSid:{type:String , select: false},
    twilioToken:{type:String , select:false}
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  },
);

export const Resturant = mongoose.model<IresturantProfile>('resturant', resturantSchema);
