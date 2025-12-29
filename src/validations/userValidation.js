// validations/userValidation.js
const Joi = require("joi");

exports.registerSchema = Joi.object({
  name: Joi.string().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  avatar_url: Joi.string().uri().allow(null, ""),
});

exports.updateSchema = Joi.object({
  name: Joi.string().min(2),
  avatar_url: Joi.string().uri().allow(null, ""),
  is_active: Joi.boolean(),
});
