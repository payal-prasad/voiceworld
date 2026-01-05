const Joi = require("joi");

const validateJoin = (data) => {
  const schema = Joi.object({
    role: Joi.string()
      .valid("host", "presenter", "viewer")
      .default("viewer")
      .messages({
        "any.only": "Role must be host, presenter, or viewer.",
      }),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Invalid field(s) provided.",
    });
  return schema.validate(data, { abortEarly: false });
};

const validateUpdate = (data) => {
  const schema = Joi.object({
    role: Joi.string()
      .valid("host", "presenter", "viewer")
      .optional()
      .messages({
        "any.only": "Role must be host, presenter, or viewer.",
      }),
    is_muted: Joi.boolean().optional().messages({
      "boolean.base": "Is muted must be true or false.",
    }),
    is_video_on: Joi.boolean().optional().messages({
      "boolean.base": "Is video on must be true or false.",
    }),
    is_screen_sharing: Joi.boolean().optional().messages({
      "boolean.base": "Is screen sharing must be true or false.",
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
    meeting_id: Joi.number().integer().optional().messages({
      "number.base": "Meeting ID must be a number.",
    }),
    user_id: Joi.number().integer().optional().messages({
      "number.base": "User ID must be a number.",
    }),
    role: Joi.string()
      .valid("host", "presenter", "viewer")
      .optional()
      .messages({
        "any.only": "Role must be host, presenter, or viewer.",
      }),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Invalid field(s) provided.",
    });
  return schema.validate(data, { abortEarly: false });
};

module.exports = { validateJoin, validateUpdate };
module.exports.validateSearchCriteria = validateSearchCriteria;
