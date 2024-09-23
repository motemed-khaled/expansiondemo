import twilio, { Twilio } from 'twilio';



export const getTwilioClient  = async (sid:string , token:string): Promise<Twilio>=>{
  return twilio(sid, token);
};


