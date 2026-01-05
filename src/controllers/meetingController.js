// controllers/meetingController.js
const service = require("../services/meetingService");
const {
  createMeetingSchema,
  updateMeetingSchema,
} = require("../validations/meetingValidation");

exports.create = async (req, res) => {
  try {
    const { error } = createMeetingSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const meeting = await service.createMeeting(req.body, req.user.id);
    res.status(201).json(meeting);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  res.json(await service.getAllMeetings());
};

exports.getById = async (req, res) => {
  try {
    res.json(await service.getMeetingById(req.params.id));
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.update = async (req, res) => {
  const { error } = updateMeetingSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  try {
    res.json(await service.updateMeeting(req.params.id, req.body));
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

exports.delete = async (req, res) => {
  await service.deleteMeeting(req.params.id);
  res.json({ message: "Meeting deleted" });
};

exports.search = async (req, res) => {
  res.json(await service.searchMeetings(req.query));
};
