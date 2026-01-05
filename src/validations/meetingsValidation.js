const Joi = require("joi");

const validateMeetings = (data) => {
  const schema = Joi.object({
    title: Joi.string().required().messages({
      "any.required": "Title is required.",
    }),
    start_time: Joi.date().optional().messages({
      "date.base": "Start time must be a valid date.",
    }),
    end_time: Joi.date().optional().messages({
      "date.base": "End time must be a valid date.",
    }),
    max_participants: Joi.number().integer().min(1).default(100).messages({
      "number.base": "Max participants must be a number.",
      "number.min": "Max participants must be at least 1.",
    }),
    is_private: Joi.boolean().default(false).messages({
      "boolean.base": "Is private must be true or false.",
    }),
    password: Joi.string()
      .when("is_private", {
        is: true,
        then: Joi.required(),
        otherwise: Joi.optional(),
      })
      .messages({
        "any.required": "Password is required for private meetings.",
      }),
    status: Joi.string()
      .valid("scheduled", "ongoing", "ended")
      .optional()
      .messages({
        "any.only": "Status must be scheduled, ongoing, or ended.",
      }),
    recording_url: Joi.string().uri().optional().messages({
      "string.uri": "Recording URL must be a valid URI.",
    }),
    url: Joi.string().uri().optional().messages({
      "string.uri": "URL must be a valid URI.",
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
    title: Joi.string().optional(),
    status: Joi.string()
      .valid("scheduled", "ongoing", "ended")
      .optional()
      .messages({
        "any.only": "Status must be scheduled, ongoing, or ended.",
      }),
    host_id: Joi.string().optional().messages({
      "string.base": "Host ID must be a string.",
    }),
  })
    .unknown(false)
    .messages({
      "object.unknown": "Invalid field(s) provided.",
    });
  return schema.validate(data, { abortEarly: false });
};

module.exports = validateMeetings;
module.exports.validateSearchCriteria = validateSearchCriteria;
