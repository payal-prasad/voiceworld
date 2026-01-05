const Joi = require("joi");

const validateInvites = (data) => {
  const schema = Joi.object({
    invited_email: Joi.string().email().required().messages({
      "string.email": "Invited email must be a valid email address.",
      "any.required": "Invited email is required.",
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
    invited_email: Joi.string().email().optional().messages({
      "string.email": "Invited email must be a valid email address.",
    }),
    status: Joi.string()
      .valid("pending", "accepted", "declined")
      .optional()
      .messages({
        "any.only": "Status must be pending, accepted, or declined.",
      }),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Invalid field(s) provided.",
    });
  return schema.validate(data, { abortEarly: false });
};

module.exports = validateInvites;
module.exports.validateSearchCriteria = validateSearchCriteria;
