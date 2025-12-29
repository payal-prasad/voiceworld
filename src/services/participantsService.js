const Participant = require("../models/participant");

exports.createParticipant = async (data, userId) => {
  const participant = await Participant.create({
    meeting_id: data.meeting_id,
    user_id: userId,
    role: data.role || "viewer",
  });

  return participant;
};

exports.getParticipantsByMeeting = async (meetingId) => {
  return await Participant.findAll({
    where: { meeting_id: meetingId },
    order: [["joined_at", "ASC"]],
  });
};

exports.updateParticipant = async (id, updates) => {
  const participant = await Participant.findByPk(id);
  if (!participant) throw new Error("Participant not found");

  await participant.update(updates);
  return participant;
};
