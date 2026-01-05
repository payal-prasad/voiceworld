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
  }
};
