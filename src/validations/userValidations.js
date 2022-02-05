const Joi = require('joi');

module.exports = {
  signUpValidation: Joi.object({
    email: Joi.string().email().required(),
    role: Joi.string().required(),
    password: Joi.string().min(8).required(),
    passwordConfirm: Joi.string().min(8).required(),
  }),
  loginValidation: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
  }),
  updateValidation: Joi.object({
    title: Joi.string(),
    image: Joi.string(),
    firstName: Joi.string().max(20).min(2),
    lastName: Joi.string().max(20).min(2),
    email: Joi.string().email(),
    role: Joi.string(),
    contact: Joi.number(),
  }),
  contactValidation: Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    message: Joi.string().min(50).required(),
  }),
  categoryValidation: Joi.object({
    name: Joi.string().required(),
  }),
  reviewValidation: Joi.object({
    rating: Joi.number().required(),
    comment: Joi.string().required(),
  }),
  subscribeValidation: Joi.object({
    email: Joi.string().email().required(),
  }),
};
