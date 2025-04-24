import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import router from './routers/index.js';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFoundHandler.js';
import { getEnvVar } from './utils/getEnvVar.js';
import { swaggerDocs } from './middlewares/swaggerDocs.js';
import { TEMP_UPLOAD_DIR } from './constants/index.js';

// Читаємо змінну оточення PORT
const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  // Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
  // наприклад, у запитах POST або PATCH
  app.use(express.json());

  //Без CORS браузери не дозволяють вебзапитам отримувати ресурси з іншого домену через політику схрещеного походження.
  app.use(cors());

  app.use(cookieParser());

  //Middleware для логування, такий як pino-http, слід розташовувати якомога раніше у ланцюгу middleware,
  // щоб він міг логувати всі вхідні запити до вашого додатку, а також відповіді та можливі помилки, що виникають під час обробки цих запитів.
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.use('/uploads', express.static(TEMP_UPLOAD_DIR));
  app.use('/api-docs', swaggerDocs());

  app.use(router);

  // Middleware для обробких не існуючих сторінок
  app.use('*', notFoundHandler);

  // Middleware для обробких помилок (приймає 4 аргументи). Завжди додається останнім
  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
