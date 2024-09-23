import express from 'express';

import { sendWhatsAppMessageHandler } from '../controllers/whatsapp/sendMessages.controller';
import { globalUploadMiddleware } from '../middlewares/global-upload.middleware';
import { sendMessageVal } from '../validators/whatsApp.val';



export const router = express.Router();

router.route('/').post(globalUploadMiddleware({fileType:'image'}).fields([{ name: 'attachments', maxCount: 5 }]) , sendMessageVal , sendWhatsAppMessageHandler);