// whatsappService.ts
import 'express-async-errors';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

import { Resturant } from '../models/resturant.model';
import { getTwilioClient } from '../utils/twilio.client';

interface SendMessageParams {
  to: string[];
  username: string;
  body?: string;
  mediaUrl?: string[];
}

export const sendWhatsAppMessages = async ({ to, username, body, mediaUrl }: SendMessageParams): Promise<void> => {
  
  try {
    const resturant = await Resturant.find().select('+twilioNumber +twilioSid +twilioToken');
    if (resturant.length === 0) 
      throw new Error('resturant profile not found');

    
    if (!(resturant[0].twilioNumber && resturant[0].twilioSid && resturant[0].twilioToken && resturant[0].plan.status)) 
      throw new Error('twilio setup not found');

    const client = await getTwilioClient(resturant[0].twilioSid , resturant[0].twilioToken);
 
    const messagePromises = to.map(async (recipient) => {
      const phoneNumber = parsePhoneNumberFromString(recipient, 'EG');
      if (!phoneNumber || !phoneNumber.isValid()) {
        throw new Error(`Invalid phone number: ${recipient}`);
      }

      const messageData: any = {
        from: 'whatsapp:' + resturant[0].twilioNumber,
        to: 'whatsapp:' + phoneNumber.format('E.164'),
      };

      if (body) {
        messageData.body = `مرحبا ${username} ${body}`;
      } else {
        messageData.body = `مرحبا ${username}`;
      }

      if (mediaUrl && mediaUrl.length > 0) {
        for (const url of mediaUrl) {
          messageData.mediaUrl = url;
          const message = await client.messages.create(messageData);
          console.log('Media message sent: ', message.sid);
        }
      } else {
        const message = await client.messages.create(messageData);
        console.log('Message sent: ', message.sid);
      }
    });

    await Promise.all(messagePromises);

  } catch (error) {
    throw new Error(`${error}`);
  }
};
