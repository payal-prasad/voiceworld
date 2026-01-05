<<<<<<< HEAD
const participantsService = require("../services/participantsService");
const meetingsService = require("../services/meetingsService");
const BusinessException = require("../exceptions/businessException");

exports.join = async (req, res, next) => {
  try {
    const meetingId = req.params.id;
    const userId = req.user.user_id;
    const result = await participantsService.joinMeeting(
      meetingId,
      userId,
      req.body
    );
    return res.status(201).json({ data: result });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.leave = async (req, res, next) => {
  try {
    const meetingId = req.params.id;
    const userId = req.user.user_id;
    const result = await participantsService.leaveMeeting(meetingId, userId);
    return res.json({ data: result });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const meetingId = req.params.id;
    const userId = req.params.userId;
    const currentUserId = req.user.user_id;
    const updated = await participantsService.updateParticipant(
      meetingId,
      userId,
      req.body,
      currentUserId
    );
    return res.json({ data: updated });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const meetingId = req.params.id;
    const items = await participantsService.getParticipants(meetingId);
    return res.json({ data: items });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.archive = async (req, res, next) => {
  try {
    await participantsService.archive(req.params.id);
    return res.status(200).json({ message: "Data removed" });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.muteParticipant = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    // Check if requester is host
    const meeting = await meetingsService.getById(id);
    if (meeting.host_id !== req.user.user_id) {
      throw new BusinessException("Only host can mute participants");
    }

    const updated = await participantsService.update(id, userId, {
      is_muted: true,
    });
    return res.json({ data: updated });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.kickParticipant = async (req, res, next) => {
  try {
    const { id, userId } = req.params;
    // Check if requester is host
    const meeting = await meetingsService.getById(id);
    if (meeting.host_id !== req.user.user_id) {
      throw new BusinessException("Only host can kick participants");
    }

    await participantsService.archive(id, userId);
    return res.status(200).json({ message: "Participant removed" });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
=======
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
>>>>>>> origin
  }
};
