import { Document } from 'mongoose';

export interface IresturantProfile extends Document {
  id: string;
  profileCover: string;
  imageProfile: string;
  rate: number;
  rateQuantity: number;
  socialMediaLinks: {
    link: string;
    icon: string;
  }[];
  name: string;
  shippingPrice: number;
  plan: {
    status:boolean;
    chief:number;
    waiter:number;
    cashier:number;
    cleaner:number;
  whatsAppService: boolean;
  };
  currency: string;
  location: string;
  cheifAlert: number;
  waiterAlert: number;
  CommercialRecord: string;
  TaxNumber: string;
  qrCodeLink: string;
  orgnizationName: string;
  branchName: string;
  twilioSid:string;
  twilioToken:string;
  twilioNumber:string;
}
