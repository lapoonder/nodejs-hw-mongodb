import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate.js';
import { checkUser } from '../middlewares/checkUser.js';
import {
  getContactsController,
  getContactByIdController,
  createContactController,
  deleteContactController,
  upsertContactController,
  patchContactController,
} from '../controllers/contacts.js';
import { ctrlWrapper } from '../utils/ctrlWrapper.js';
import { validateBody } from '../middlewares/validateBody.js';
import {
  createContactSchema,
  updateContactSchema,
} from '../validation/contact.js';
import { isValidId } from '../middlewares/isValidId.js';
import { upload } from '../middlewares/multer.js';

const router = Router();

router.use(authenticate);

router.get('/', checkUser(), ctrlWrapper(getContactsController));

router.get(
  '/:contactId',
  checkUser(),
  isValidId,
  ctrlWrapper(getContactByIdController),
);

router.post(
  '/',
  checkUser(),
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(createContactController),
);

router.delete(
  '/:contactId',
  checkUser(),
  isValidId,
  ctrlWrapper(deleteContactController),
);

router.put(
  '/:contactId',
  checkUser(),
  isValidId,
  upload.single('photo'),
  validateBody(createContactSchema),
  ctrlWrapper(upsertContactController),
);

router.patch(
  '/:contactId',
  checkUser(),
  isValidId,
  upload.single('photo'),
  validateBody(updateContactSchema),
  ctrlWrapper(patchContactController),
);

export default router;
