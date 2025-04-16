import {
  getAllContacts,
  getContactById,
  createContact,
  deleteContact,
  updateContact,
} from '../services/contacts.js';
import createHttpError from 'http-errors';
import { parsePaginationParams } from '../utils/parsePaginationParams.js';
import { parseSortParams } from '../utils/parseSortParams.js';
import { parseFilterParams } from '../utils/parseFilterParams.js';
import { saveFileToCloudinary } from '../utils/saveFileToCloudinary.js';

export const getContactsController = async (req, res) => {
  const { page, perPage } = parsePaginationParams(req.query);
  const { sortBy, sortOrder } = parseSortParams(req.query);
  const filter = parseFilterParams(req.query);
  const userId = req.user._id;
  const contacts = await getAllContacts({
    page,
    perPage,
    sortBy,
    sortOrder,
    userId,
    filter,
  });

  // Відповідь, якщо контактів не знайдено
  if (!contacts) {
    throw createHttpError(404, 'Contacts not found!'); //Створюємо та налаштовуємо помилку
  }

  res.json({
    status: 200,
    message: 'Successfully found contacts!',
    data: contacts,
  });
};

export const getContactByIdController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;
  const contact = await getContactById(contactId, userId);

  // Відповідь, якщо контакт не знайдено
  if (!contact) {
    throw createHttpError(404, 'Contact not found'); //Створюємо та налаштовуємо помилку
  }
  // Відповідь, якщо контакт знайдено
  res.json({
    status: 200,
    message: `Successfully found contact with id ${contactId}!`,
    data: contact,
  });
};

export const createContactController = async (req, res) => {
  const userId = req.user._id;
  const photo = req.file;

  let photoUrl;
  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }
  const updatePayload = {
    ...req.body,
  };
  if (photoUrl) {
    updatePayload.photo = photoUrl;
  }

  const contact = await createContact({ ...updatePayload, userId });

  res.status(201).json({
    status: 201,
    message: `Successfully created a contact!`,
    data: contact,
  });
};

export const deleteContactController = async (req, res) => {
  const { contactId } = req.params;
  const userId = req.user._id;

  const contact = await deleteContact(contactId, userId);

  if (!contact) {
    throw createHttpError(404, 'Contact not found');
  }

  res.status(204).send();
};

export const upsertContactController = async (req, res) => {
  const { contactId } = req.params;
  const photo = req.file;
  const userId = req.user._id;

  let photoUrl;

  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }

  const updatePayload = {
    ...req.body,
  };

  if (photoUrl) {
    updatePayload.photo = photoUrl;
  }

  const result = await updateContact(contactId, userId, updatePayload, {
    upsert: true,
  });

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  const status = result.isNew ? 201 : 200;

  res.status(status).json({
    status: status,
    message: `Successfully upserted a contact!`,
    data: result.contact,
  });
};

export const patchContactController = async (req, res) => {
  const { contactId } = req.params;
  const photo = req.file;

  const userId = req.user._id;
  let photoUrl;

  if (photo) {
    photoUrl = await saveFileToCloudinary(photo);
  }

  const updatePayload = {
    ...req.body,
  };

  if (photoUrl) {
    updatePayload.photo = photoUrl;
  }

  const result = await updateContact(contactId, userId, updatePayload);

  if (!result) {
    throw createHttpError(404, 'Contact not found');
  }

  res.json({
    status: 200,
    message: `Successfully patched a contact!`,
    data: result.contact,
  });
};
