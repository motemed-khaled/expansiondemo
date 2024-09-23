import express from 'express';

import * as handler from '../controllers/invoice';
import { isAuth, UserType } from '../guards/IsAuth.guard';
import * as val from '../validators/invoice.val';

export const router = express.Router();
router.use(isAuth([UserType.stuff]));
router
  .route('/')
  .post(val.createInvoiceVal, handler.createInvoiceHandler)
  .get(val.getAllInvoiceVal, handler.getAllInvoiceHandler);

router
  .route('/:invoiceId')
  .get(val.getInvoiceVal, handler.getInvoiceHandler)
  .delete(val.deleteInvoiceVal, handler.deleteInvoiceHandler);
