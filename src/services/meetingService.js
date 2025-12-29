// services/meetingService.js
const { Op } = require("sequelize");
const Meeting = require("../models/meeting");

exports.createMeeting = async (data, userId) => {
  const meeting = await Meeting.create({
    title: data.title,
    start_time: data.start_time,
    end_time: data.end_time,
    host_user_id: userId,
  });
  return meeting;
};

exports.getAllMeetings = async () => {
  return Meeting.findAll({
    where: { is_deleted: false },
  });
};

exports.getMeetingById = async (id) => {
  const meeting = await Meeting.findOne({
    where: { id, is_deleted: false },
  });
  if (!meeting) throw new Error("Meeting not found");
  return meeting;
};

exports.updateMeeting = async (id, data) => {
  const meeting = await Meeting.findByPk(id);
  if (!meeting || meeting.is_deleted) throw new Error("Meeting not found");
  await meeting.update(data);
  return meeting;
};

exports.deleteMeeting = async (id) => {
  const meeting = await Meeting.findByPk(id);
  if (!meeting) throw new Error("Meeting not found");
  await meeting.update({ is_deleted: true });
};

exports.searchMeetings = async (criteria) => {
  const where = { is_deleted: false };

  if (criteria.title) {
    where.title = { [Op.iLike]: `%${criteria.title}%` };
  }

  if (criteria.host_user_id) {
    where.host_user_id = criteria.host_user_id;
  }

  return Meeting.findAll({ where });
};
