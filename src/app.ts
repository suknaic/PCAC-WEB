import 'express-async-errors';
import 'dotenv/config';
import { AppError } from '@error/AppError';
import cors from 'cors';
import express, { NextFunction, Request, Response } from 'express';
import { engine } from 'express-handlebars';
import session from 'express-session';
import { resolve } from 'path';

import { routers } from './routes';

const app = express();
app.use(
  session({
    secret: process.env.SECRET_TOKEN,
    resave: true,
    saveUninitialized: true,
    // alterar para true quando finalizar o desenvolvimento
  })
);
app.use(
  express.urlencoded({
    extended: false,
  })
);

app.use(cors());

app.engine(
  '.hbs',
  engine({
    extname: '.hbs',
    helpers: {
      // getFileExt: (filename: string) => filename.split('.').pop() === 'pdf',
      dateFormat: (date: string) => new Date(date).toLocaleDateString('en-GB'),
      truncate: (data: string, tamanho: number) =>
        `${data.slice(0, tamanho)} ...`,
    },
  })
);
app.set('view engine', '.hbs');
app.set('views', resolve(__dirname, 'views'));
app.use('/public', express.static(resolve(__dirname, '..', 'public')));
app.use('/avatar', express.static(resolve(__dirname, '..', 'temp', 'avatar')));
app.use(
  '/solicitacao',
  express.static(resolve(__dirname, '..', 'temp', 'solicitacao'))
);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: err.statusCode,
      message: err.message,
    });
  }

  console.error(`${err.message}`, 500);
  return response.status(500).json({
    status: 'error',
    message: err.message,
  });
});
app.use(routers);

export { app };
