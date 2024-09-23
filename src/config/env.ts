import { config } from 'dotenv';

config();

export const env = {
  port: +(process.env.PORT || 3000) as number,
  environment: process.env.NODE_ENV || 'development',
  mongoDb: {
    uri: process.env.MONGO_URI as string,
  },
  bcrypt: {
    salt: +(process.env.BCRYPT_SALT || 10) as number,
    paper: (process.env.BCRYPT_PAPER || 'password') as string,
  },
  jwt: {
    secret: process.env.JWT_KEY as string,
  },
  key: {
    apiKey: process.env.API_KEY,
  },
  redis: {
    uri: process.env.REDIS_HOST as string,
  },
  twilio:{
    sid:process.env.TWILIO_ACCOUNT_SID,
    token:process.env.TWILIO_AUTH_TOKEN ,
    number:process.env.TWILIO_WHATSAPP_NUMBER
  }
};

export const checkEnvVariables = () => {
  if (!env.mongoDb.uri) throw new Error('env:MONGO_URI must be defined');
  if (!env.jwt.secret) throw new Error('env:JWT_KEY must be defined');
};
