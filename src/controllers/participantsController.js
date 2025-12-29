const participantService = require("../services/participantService");
const {
  createParticipantSchema,
  updateParticipantSchema,
} = require("../validations/participantValidation");

exports.create = async (req, res) => {
  try {
    const { error } = createParticipantSchema.validate(req.body);
    if (error)
      return res.status(400).json({ error: error.details[0].message });

    const participant = await participantService.createParticipant(
      req.body,
      req.user.id
    );

    res.status(201).json({ success: true, participant });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAllByMeeting = async (req, res) => {
  try {
    const participants =
      await participantService.getParticipantsByMeeting(
        req.params.meetingId
      );

    res.json({ success: true, participants });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const { error } = updateParticipantSchema.validate(req.body);
    if (error)
      return res.status(400).json({ error: error.details[0].message });

    const participant = await participantService.updateParticipant(
      req.params.id,
      req.body
    );

    res.json({ success: true, participant });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
