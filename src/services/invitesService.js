const Invites = require("../models/Invites");
const Meetings = require("../models/Meetings");
const BusinessException = require("../exceptions/businessException");
const validateInvites = require("../validations/invitesValidation");
const { Op } = require("sequelize");

exports.getInvites = async (meetingId, userId) => {
  const meeting = await Meetings.findOne({ where: { id: meetingId } });
  if (!meeting || meeting.host_id !== userId)
    throw new BusinessException("Unauthorized");

  const invites = await Invites.findAll({
    where: { meeting_id: meeting.meeting_id },
  });
  return invites.map((i) => i.toJSON());
};

exports.sendInvite = async (meetingId, userId, payload) => {
  const meeting = await Meetings.findOne({ where: { id: meetingId } });
  if (!meeting || meeting.host_id !== userId)
    throw new BusinessException("Unauthorized");

  const { error } = validateInvites(payload);
  if (error) throw new BusinessException(error.details[0].message);

  const existing = await Invites.findOne({
    where: {
      meeting_id: meeting.meeting_id,
      invited_email: payload.invited_email,
    },
  });
  if (existing) throw new BusinessException("Already invited");

  const invite = await Invites.create({
    meeting_id: meeting.meeting_id,
    invited_email: payload.invited_email,
    sent_at: new Date(),
  });

  return invite.toJSON();
};

exports.archive = async (id) => {
  const item = await Invites.findByPk(id);
  if (!item) throw new BusinessException("Invite not found");
  await item.destroy();
};

exports.searchInvites = async (criteria) => {
  const { error } = validateInvites.validateSearchCriteria(criteria);
  if (error) throw new BusinessException(error.details[0].message);
  const whereClause = {};
  if (criteria.meeting_id) whereClause.meeting_id = criteria.meeting_id;
  if (criteria.invited_email)
    whereClause.invited_email = { [Op.like]: `%${criteria.invited_email}%` };
  if (criteria.status) whereClause.status = criteria.status;
  const items = await Invites.findAll({ where: whereClause });
  return items.map((i) => i.toJSON());
};
