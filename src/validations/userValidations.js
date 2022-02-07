const Joi = require('joi');

module.exports = {
  signUpValidation: Joi.object({
    email: Joi.string().trim().email().required(),
    role: Joi.string().trim().required(),
    password: Joi.string().trim().min(8).required(),
    passwordConfirm: Joi.string().trim().min(8).required(),
  }),
  loginValidation: Joi.object({
    email: Joi.string().trim().email().required(),
    password: Joi.string().trim().min(8).required(),
  }),
  updateValidation: Joi.object({
    title: Joi.string().trim(),
    image: Joi.string().trim(),
    firstName: Joi.string().trim().max(20).min(2),
    lastName: Joi.string().trim().max(20).min(2),
    email: Joi.string().trim().email(),
    role: Joi.string().trim(),
    contact: Joi.number(),
  }),
  contactValidation: Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().email().required(),
    message: Joi.string().trim().min(50).required(),
  }),
  categoryValidation: Joi.object({
    name: Joi.string().trim().required(),
  }),
  subscribeValidation: Joi.object({
    email: Joi.string().trim().email().required(),
  }),
  faqValidation: Joi.object({
    question: Joi.string().required(),
    answer: Joi.string().trim().required(),
  }),
};
