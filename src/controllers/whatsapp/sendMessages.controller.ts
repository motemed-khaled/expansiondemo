import 'express-async-errors';

import { Customer } from '../../models/customer.model';
import { Resturant } from '../../models/resturant.model';
import { sendWhatsAppMessages } from '../../services/whatsApp.services';
import { SendWhatsAppMessageHandler } from '../../types/endpoints/whatsApp.endpoint';
import { BadRequestError } from '../../utils/errors/bad-request-error';
import { NotFoundError } from '../../utils/errors/notfound-error';
import { UnauthorizedError } from '../../utils/errors/un-authorizedError';
import { saveFiles } from '../../utils/file';


export const sendWhatsAppMessageHandler:SendWhatsAppMessageHandler = async (req,res,next)=>{

  try {
    const resturant = await Resturant.find();
    if (resturant.length === 0) 
      return next(new NotFoundError('resturant not found'));

    if (!resturant[0].plan.whatsAppService) 
      return next(new UnauthorizedError('you dont have permission to use this service now please contact with support team'));

    const files = <{ attachments?: [Express.Multer.File] }>req.files;
    if (req.body.users){
      const userCount = await Customer.countDocuments({_id:req.body.users.map(el => el)});
      if (userCount != req.body.users.length) 
        return next(new BadRequestError('invalid users'));
    }

    const baseUrl = `${req.protocol}://${req.get('host')}`;

    if (files.attachments?.length) {
      req.body.attachments = files.attachments.map(el => {
        saveFiles('images' , el);
        return `${baseUrl}/media/images/${el?.filename}`;
      });
    }
  
    const users = await Customer.find({ _id: { $in: req.body.users } });

    const to = users.map(user => user.phone);
    const username = users[0].name || ''; 
    const body = req.body.messageBody;
    const mediaUrl = req.body.attachments;

    await sendWhatsAppMessages({ to, username, body, mediaUrl });

    res.status(200).send();
  } catch (error) {
    return next(new BadRequestError(`${error}`));
  }

};