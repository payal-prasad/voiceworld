// validations/meetingValidation.js
const Joi = require("joi");

exports.createMeetingSchema = Joi.object({
  title: Joi.string().min(3).required(),
  start_time: Joi.date().required(),
  end_time: Joi.date().greater(Joi.ref("start_time")).required(),
});

exports.updateMeetingSchema = Joi.object({
  title: Joi.string().min(3),
  start_time: Joi.date(),
  end_time: Joi.date(),
});
