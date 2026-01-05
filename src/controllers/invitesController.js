const invitesService = require("../services/invitesService");
const BusinessException = require("../exceptions/businessException");

exports.getAll = async (req, res, next) => {
  try {
    const meetingId = req.params.id;
    const userId = req.user.user_id;
    const items = await invitesService.getInvites(meetingId, userId);
    return res.json({ data: items });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.send = async (req, res, next) => {
  try {
    const meetingId = req.params.id;
    const userId = req.user.user_id;
    const created = await invitesService.sendInvite(
      meetingId,
      userId,
      req.body
    );
    return res.status(201).json({ data: created });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.archive = async (req, res, next) => {
  try {
    await invitesService.archive(req.params.id);
    return res.status(200).json({ message: "Data removed" });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.searchInvites = async (req, res, next) => {
  try {
    const items = await invitesService.searchInvites(req.query);
    if (!items || items.length === 0) {
      return res
        .status(404)
        .json({ error: "No data found for the given criteria." });
    }
    return res.json({
      statusCode: 200,
      isSuccess: true,
      message: "Search completed successfully",
      data: items,
    });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};
