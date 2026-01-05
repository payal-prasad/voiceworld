const Joi = require("joi");

const validateUsers = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),
    password: Joi.string().min(6).required().messages({
      "string.min": "Password must be at least 6 characters.",
      "any.required": "Password is required.",
    }),
    name: Joi.string().required().messages({
      "any.required": "Name is required.",
    }),
    avatar_url: Joi.string().uri().optional().messages({
      "string.uri": "Avatar URL must be a valid URI.",
    }),
    role: Joi.string().valid("admin", "user").default("user").messages({
      "any.only": "Role must be admin or user.",
    }),
    is_active: Joi.boolean().default(true).messages({
      "boolean.base": "Is active must be true or false.",
    }),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Invalid field(s) provided.",
    });
  return schema.validate(data, { abortEarly: false });
};

const validateLogin = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),
    password: Joi.string().required().messages({
      "any.required": "Password is required.",
    }),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Invalid field(s) provided.",
    });
  return schema.validate(data, { abortEarly: false });
};

const validateSearchCriteria = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().optional().messages({
      "string.email": "Email must be a valid email address.",
    }),
    name: Joi.string().optional(),
    role: Joi.string().valid("admin", "user").optional().messages({
      "any.only": "Role must be admin or user.",
    }),
    is_active: Joi.boolean().optional().messages({
      "boolean.base": "Is active must be true or false.",
    }),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Invalid field(s) provided.",
    });
  return schema.validate(data, { abortEarly: false });
};

const validateSendOTP = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Invalid field(s) provided.",
    });
  return schema.validate(data, { abortEarly: false });
};

const validateVerifyOTP = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().messages({
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),
    otp: Joi.string().length(6).required().messages({
      "string.length": "OTP must be 6 digits.",
      "any.required": "OTP is required.",
    }),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Invalid field(s) provided.",
    });
  return schema.validate(data, { abortEarly: false });
};

module.exports = validateUsers;
module.exports.validateLogin = validateLogin;
module.exports.validateSearchCriteria = validateSearchCriteria;
module.exports.validateSendOTP = validateSendOTP;
module.exports.validateVerifyOTP = validateVerifyOTP;
