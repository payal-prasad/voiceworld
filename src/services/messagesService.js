const Messages = require("../models/Messages");
const Participants = require("../models/Participants");
const BusinessException = require("../exceptions/businessException");
const validateMessages = require("../validations/messagesValidation");
const { Op } = require("sequelize");

exports.getMessages = async (meetingId, userId) => {
  const meeting = await require("../models/Meetings").findOne({
    where: { id: meetingId },
  });
  if (!meeting) throw new BusinessException("Meeting not found");

  const participant = await Participants.findOne({
    where: { meeting_id: meeting.meeting_id, user_id: userId, left_at: null },
  });
  if (!participant)
    throw new BusinessException("Not authorized to view messages");

  const messages = await Messages.findAll({
    where: { meeting_id: meeting.meeting_id },
    include: [
      {
        model: require("../models/Users"),
        as: "sender",
        attributes: ["id", "name"],
      },
    ],
    order: [["timestamp", "ASC"]],
  });
  return messages.map((m) => m.toJSON());
};

exports.sendMessage = async (meetingId, userId, payload) => {
  const meeting = await require("../models/Meetings").findOne({
    where: { id: meetingId },
  });
  if (!meeting) throw new BusinessException("Meeting not found");

  const participant = await Participants.findOne({
    where: { meeting_id: meeting.meeting_id, user_id: userId, left_at: null },
  });
  if (!participant) throw new BusinessException("Not in meeting");

  const { error } = validateMessages(payload);
  if (error) throw new BusinessException(error.details[0].message);

  const message = await Messages.create({
    meeting_id: meeting.meeting_id,
    user_id: userId,
    message: payload.message,
    type: payload.type,
    file_url: payload.file_url,
    timestamp: new Date(),
  });

  return message.toJSON();
};

exports.archive = async (id) => {
  const item = await Messages.findByPk(id);
  if (!item) throw new BusinessException("Message not found");
  await item.destroy();
};

exports.searchMessages = async (criteria) => {
  const { error } = validateMessages.validateSearchCriteria(criteria);
  if (error) throw new BusinessException(error.details[0].message);
  const whereClause = {};
  if (criteria.meeting_id) whereClause.meeting_id = criteria.meeting_id;
  if (criteria.user_id) whereClause.user_id = criteria.user_id;
  if (criteria.message)
    whereClause.message = { [Op.like]: `%${criteria.message}%` };
  const items = await Messages.findAll({
    where: whereClause,
    include: [
      {
        model: require("../models/Users"),
        as: "sender",
        attributes: ["id", "name"],
      },
    ],
  });
  return items.map((i) => i.toJSON());
};
