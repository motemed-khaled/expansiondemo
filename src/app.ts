import path from 'path';

import cors from 'cors';
import express from 'express';

import { globalErrorHandlingMiddleware } from './middlewares/global-error-handling.middleware';
import { mountRoutes } from './routes/index';

export const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    origin: '*',
  }),
);

app.set('trust proxy', true);
app.use('/media', express.static('media'));

mountRoutes(app);

const menuPath = path.join(process.cwd(), 'menu', 'build');
const guestPath = path.join(process.cwd(), 'guest', 'web');

app.use(express.static(path.join(__dirname, '../client', 'build')));
app.use('/menu', express.static(menuPath));
app.use('/guest', express.static(guestPath));

app.get('/menu', (req, res) => {
  res.sendFile(path.join(menuPath, 'index.html'));
});

app.get('/guest', (req, res) => {
  res.sendFile(path.join(guestPath, 'index.html'));
});

app.get('/admin/*', (req, res) => {
  res.sendFile(path.join(__dirname , '../client', 'build', 'index.html'));
});

// app.get('*', (req, res) => {
//   res.sendFile(path.join(menuPath, 'index.html'));
// });

app.use(globalErrorHandlingMiddleware);
