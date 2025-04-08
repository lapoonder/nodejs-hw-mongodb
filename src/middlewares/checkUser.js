import createHttpError from 'http-errors';

import { ContactsCollection } from '../db/models/contact.js';

export const checkUser =
  (...roles) =>
  async (req, res, next) => {
    const { user } = req;
    if (!user) {
      next(createHttpError(401));
      return;
    }

    const { contactId } = req.params;
    if (!contactId) {
      next(createHttpError(403));
      return;
    }

    const contact = await ContactsCollection.findOne({
      _id: contactId,
      userId: user._id,
    });

    if (contact) {
      next();
      return;
    }

    next(createHttpError(403));
  };
