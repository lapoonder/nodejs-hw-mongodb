import Joi from 'joi';
import { isValidObjectId } from 'mongoose';

export const createContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).required().messages({
    'string.base': 'Name should be a string',
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
    'any.required': 'Name is required',
  }),
  phoneNumber: Joi.string().min(3).max(20).required().messages({
    'string.base': 'None correct phone number',
    'string.min': 'Number should have at least {#limit} characters',
    'string.max': 'Number should have at most {#limit} characters',
    'any.required': 'Phone number is required',
  }),
  email: Joi.string().min(3).max(20).messages({
    'string.base': 'None correct email',
    'string.min': 'Email should have at least {#limit} characters',
    'string.max': 'Email should have at most {#limit} characters',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .valid('work', 'home', 'personal')
    .min(3)
    .max(20)
    .required()
    .messages({
      'string.base': 'None correct type contact',
      'string.min': 'Type should have at least {#limit} characters',
      'string.max': 'Type should have at most {#limit} characters',
      'any.required': 'Type contact is required',
    }),
  userId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      // @ts-ignore
      return helper.message('User id should be a valid mongo id');
    }
    return true;
  }),
});

export const updateContactSchema = Joi.object({
  name: Joi.string().min(3).max(20).messages({
    'string.base': 'Name should be a string', // Кастомізація повідомлення для типу "string"
    'string.min': 'Name should have at least {#limit} characters',
    'string.max': 'Name should have at most {#limit} characters',
  }),
  phoneNumber: Joi.string().min(3).max(20).messages({
    'string.base': 'None correct phone number',
    'string.min': 'Number should have at least {#limit} characters',
    'string.max': 'Number should have at most {#limit} characters',
  }),
  email: Joi.string().min(3).max(20).messages({
    'string.base': 'None correct email',
    'string.min': 'Email should have at least {#limit} characters',
    'string.max': 'Email should have at most {#limit} characters',
  }),
  isFavourite: Joi.boolean(),
  contactType: Joi.string()
    .min(3)
    .max(20)
    .valid('work', 'home', 'personal')
    .messages({
      'string.base': 'None correct type contact',
      'string.min': 'Type should have at least {#limit} characters',
      'string.max': 'Type should have at most {#limit} characters',
    }),
  userId: Joi.string().custom((value, helper) => {
    if (value && !isValidObjectId(value)) {
      // @ts-ignore
      return helper.message('User id should be a valid mongo id');
    }
    return true;
  }),
});
