import { Application } from 'express';

import { router as cartRoutes } from './cart.routes';
import { router as catogryRoutes } from './catogry.routes';
import { router as customerRoutes } from './customer.routes';
import { router as helpRoutes } from './help.routes';
import { router as invoiceRoutes } from './invoice.routes';
import { router as analysisRoutes } from './order-analysis.routes';
import { router as orderRoutes } from './order.routes';
import { router as productRoutes } from './product.routes';
import { router as rateRoutes } from './rate.routes';
import { router as resturantRoutes } from './resturant.routes';
import { router as rolesRoutes } from './role.routes';
import { router as sliderRoutes } from './slider.routes';
import { router as storeRoutes } from './store.routes';
import { router as stuffRoutes } from './stuff.routes';
import { router as typeRoutes } from './types.routes';
import { router as waitingRoutes } from './waiting.routes';
import { router as whatsappRoutes } from './whatsApp.routes';

export const mountRoutes = (app: Application) => {
  app.use('/api/v1/profile', resturantRoutes);
  app.use('/api/v1/customer', customerRoutes);
  app.use('/api/v1/catogry', catogryRoutes);
  app.use('/api/v1/product', productRoutes);
  app.use('/api/v1/cart', cartRoutes);
  app.use('/api/v1/order', orderRoutes);
  app.use('/api/v1/role', rolesRoutes);
  app.use('/api/v1/type', typeRoutes);
  app.use('/api/v1/stuff', stuffRoutes);
  app.use('/api/v1/rate', rateRoutes);
  app.use('/api/v1/help', helpRoutes);
  app.use('/api/v1/analysis', analysisRoutes);
  app.use('/api/v1/waiting', waitingRoutes);
  app.use('/api/v1/slider', sliderRoutes);
  app.use('/api/v1/store', storeRoutes);
  app.use('/api/v1/invoice', invoiceRoutes);
  app.use('/api/v1/whatsapp', whatsappRoutes);
};
