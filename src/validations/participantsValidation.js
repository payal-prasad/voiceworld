const Joi = require("joi");

exports.createParticipantSchema = Joi.object({
  meeting_id: Joi.number().integer().required(),
  role: Joi.string().valid("host", "presenter", "viewer").optional(),
});

exports.updateParticipantSchema = Joi.object({
  role: Joi.string().valid("host", "presenter", "viewer").optional(),
  is_muted: Joi.boolean().optional(),
  is_video_on: Joi.boolean().optional(),
  is_screen_sharing: Joi.boolean().optional(),
  left_at: Joi.date().optional(),
});
