const Joi = require("joi");

const validateMessages = (data) => {
  const schema = Joi.object({
    message: Joi.string().required().messages({
      "any.required": "Message is required.",
    }),
    type: Joi.string().valid("text", "file").default("text").messages({
      "any.only": "Type must be text or file.",
    }),
    file_url: Joi.string()
      .uri()
      .when("type", {
        is: "file",
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        "any.required": "File URL is required for file messages.",
        "string.uri": "File URL must be a valid URI.",
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
    message: Joi.string().optional(),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Invalid field(s) provided.",
    });
  return schema.validate(data, { abortEarly: false });
};

module.exports = validateMessages;
module.exports.validateSearchCriteria = validateSearchCriteria;
