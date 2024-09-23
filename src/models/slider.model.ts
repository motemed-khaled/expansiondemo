import mongoose from 'mongoose';

import { Islider } from '../types/slider';

const sliderSchema = new mongoose.Schema<Islider>(
  {
    images: [String],
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  },
);

export const Slider = mongoose.model<Islider>('sliders', sliderSchema);
