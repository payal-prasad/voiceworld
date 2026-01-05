const Meetings = require("../models/Meetings");
const BusinessException = require("../exceptions/businessException");
const validateMeetings = require("../validations/meetingsValidation");
const { Op } = require("sequelize");

exports.getAll = async (query = {}) => {
  const items = await Meetings.findAll({
    limit: 100,
    include: [
      {
        model: require("../models/Users"),
        as: "host",
        attributes: ["id", "name", "email"],
      },
    ],
  });
  return items.map((i) => i.toJSON());
};

exports.getById = async (id) => {
  const item = await Meetings.findOne({
    where: { id: id },
    include: [
      {
        model: require("../models/Users"),
        as: "host",
        attributes: ["id", "name", "email"],
      },
    ],
  });
  if (!item) return null;
  return item.toJSON();
};

exports.create = async (payload, userId) => {
  const { error } = validateMeetings(payload);
  if (error) throw new BusinessException(error.details[0].message);
  payload.host_id = userId;
  payload.meeting_id = Math.random().toString(36).substring(2, 8).toUpperCase();
  payload.status = "scheduled";

  if (!payload.createdAt) payload.createdAt = new Date();
  const created = await Meetings.create(payload);
  return created.toJSON();
};

exports.update = async (id, updates, userId) => {
  const item = await Meetings.findOne({ where: { id: id } });
  if (!item) throw new BusinessException("Meeting not found");
  if (item.host_id !== userId) throw new BusinessException("Unauthorized");
  const { error } = validateMeetings(updates);
  if (error) throw new BusinessException(error.details[0].message);
  await item.update(updates);
  return item.toJSON();
};

exports.archive = async (id) => {
  const item = await Meetings.findByPk(id);
  if (!item) throw new BusinessException("Meeting not found");
  await item.destroy();
};

exports.searchMeetings = async (criteria) => {
  const { error } = validateMeetings.validateSearchCriteria(criteria);
  if (error) throw new BusinessException(error.details[0].message);
  const whereClause = {};
  if (criteria.title) whereClause.title = { [Op.like]: `%${criteria.title}%` };
  if (criteria.status) whereClause.status = criteria.status;
  if (criteria.host_id) whereClause.host_id = criteria.host_id;
  const items = await Meetings.findAll({
    where: whereClause,
    include: [
      {
        model: require("../models/Users"),
        as: "host",
        attributes: ["id", "name", "email"],
      },
    ],
  });
  return items.map((i) => i.toJSON());
};
