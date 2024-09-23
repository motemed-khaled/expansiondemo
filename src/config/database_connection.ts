import mongoose from 'mongoose';

import { env } from './env';

export const dbConnection = () => {
  return mongoose
    .connect(env.mongoDb.uri)
    .then((con) => {
      console.log(`database connection : ${con.connection.host}`);
    })
    .catch(() => {
      throw new Error('database connection error');
    });
};
