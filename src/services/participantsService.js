const Participants = require("../models/Participants");
const Meetings = require("../models/Meetings");
const BusinessException = require("../exceptions/businessException");
const validateParticipants = require("../validations/participantsValidation");
const { Op } = require("sequelize");

exports.joinMeeting = async (meetingId, userId, payload) => {
  const { error } = validateParticipants.validateJoin(payload);
  if (error) throw new BusinessException(error.details[0].message);

  const meeting = await Meetings.findOne({ where: { id: meetingId } });
  if (!meeting) throw new BusinessException("Meeting not found");

  const existing = await Participants.findOne({
    where: { meeting_id: meeting.meeting_id, user_id: userId },
  });
  if (existing && !existing.left_at)
    throw new BusinessException("Already joined");

  const participant = await Participants.create({
    meeting_id: meeting.meeting_id,
    user_id: userId,
    role: payload.role,
    joined_at: new Date(),
  });

  return participant.toJSON();
};

exports.leaveMeeting = async (meetingId, userId) => {
  const meeting = await Meetings.findOne({ where: { id: meetingId } });
  if (!meeting) throw new BusinessException("Meeting not found");

  const participant = await Participants.findOne({
    where: { meeting_id: meeting.meeting_id, user_id: userId, left_at: null },
  });
  if (!participant) throw new BusinessException("Not in meeting");

  await participant.update({ left_at: new Date() });
  return { message: "Left meeting successfully" };
};

exports.updateParticipant = async (
  meetingId,
  userId,
  updates,
  currentUserId
) => {
  const meeting = await Meetings.findOne({ where: { id: meetingId } });
  if (!meeting) throw new BusinessException("Meeting not found");

  const participant = await Participants.findOne({
    where: { meeting_id: meeting.meeting_id, user_id: userId, left_at: null },
  });
  if (meeting.host_id !== currentUserId && userId !== currentUserId)
    throw new BusinessException("Unauthorized");

  const { error } = validateParticipants.validateUpdate(updates);
  if (error) throw new BusinessException(error.details[0].message);

  await participant.update(updates);
  return participant.toJSON();
};

exports.getParticipants = async (meetingId) => {
  const meeting = await Meetings.findOne({ where: { id: meetingId } });
  if (!meeting) throw new BusinessException("Meeting not found");

  const participants = await Participants.findAll({
    where: { meeting_id: meeting.meeting_id, left_at: null },
    include: [
      {
        model: require("../models/Users"),
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
  });
  return participants.map((p) => p.toJSON());
};

exports.archive = async (id) => {
  const item = await Participants.findByPk(id);
  if (!item) throw new BusinessException("Participant not found");
  await item.destroy();
};

exports.searchParticipants = async (criteria) => {
  const { error } = validateParticipants.validateSearchCriteria(criteria);
  if (error) throw new BusinessException(error.details[0].message);
  const whereClause = { left_at: null };
  if (criteria.meeting_id) whereClause.meeting_id = criteria.meeting_id;
  if (criteria.user_id) whereClause.user_id = criteria.user_id;
  if (criteria.role) whereClause.role = criteria.role;
  const items = await Participants.findAll({
    where: whereClause,
    include: [
      {
        model: require("../models/Users"),
        as: "user",
        attributes: ["id", "name", "email"],
      },
    ],
  });
  return items.map((i) => i.toJSON());
};
