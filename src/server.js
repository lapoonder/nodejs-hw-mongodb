import express from 'express';
import pino from 'pino-http';
import cors from 'cors';
import { getAllContacts, getContactById } from './services/contacts.js';
import { getEnvVar } from './utils/getEnvVar.js';

// Читаємо змінну оточення PORT
const PORT = Number(getEnvVar('PORT', '3000'));

export const setupServer = () => {
  const app = express();

  // Вбудований у express middleware для обробки (парсингу) JSON-даних у запитах
  // наприклад, у запитах POST або PATCH
  app.use(express.json());

  //Без CORS браузери не дозволяють вебзапитам отримувати ресурси з іншого домену через політику схрещеного походження.
  app.use(cors());

  //Middleware для логування, такий як pino-http, слід розташовувати якомога раніше у ланцюгу middleware,
  // щоб він міг логувати всі вхідні запити до вашого додатку, а також відповіді та можливі помилки, що виникають під час обробки цих запитів.
  app.use(
    pino({
      transport: {
        target: 'pino-pretty',
      },
    }),
  );

  app.get('/', (req, res) => {
    res.json({
      message: 'Hello world!',
    });
  });

  app.get('/contacts', async (req, res) => {
    const contacts = await getAllContacts();

    res.status(200).json({
      message: 'Successfully found contacts!',
      data: contacts,
    });
  });

  app.get('/contacts/:contactId', async (req, res, next) => {
    const { contactId } = req.params;
    const contact = await getContactById(contactId);

    // Відповідь, якщо контакт не знайдено
    if (!contact) {
      res.status(404).json({
        message: 'Contact not found',
      });
      return;
    }

    // Відповідь, якщо контакт знайдено
    res.status(200).json({
      message: `Successfully found contact with id ${contactId}!`,
      data: contact,
    });
  });

  // Middleware для обробких не існуючих сторінок
  app.use('*', (req, res, next) => {
    res.status(404).json({
      message: 'Not found',
    });
  });

  // Middleware для обробких помилок (приймає 4 аргументи). Завжди додається останнім
  app.use((err, req, res, next) => {
    res.status(500).json({
      message: 'Something went wrong',
      error: err.message,
    });
  });

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};
