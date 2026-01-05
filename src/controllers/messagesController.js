const messagesService = require("../services/messagesService");
const BusinessException = require("../exceptions/businessException");

exports.getAll = async (req, res, next) => {
  try {
    const meetingId = req.params.id;
    const userId = req.user.user_id;
    const items = await messagesService.getMessages(meetingId, userId);
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
    const created = await messagesService.sendMessage(
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
    await messagesService.archive(req.params.id);
    return res.status(200).json({ message: "Data removed" });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.searchMessages = async (req, res, next) => {
  try {
    const items = await messagesService.searchMessages(req.query);
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
