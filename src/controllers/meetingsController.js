const meetingsService = require("../services/meetingsService");
const BusinessException = require("../exceptions/businessException");

exports.getById = async (req, res, next) => {
  try {
    const i = await meetingsService.getById(req.params.id);
    if (!i) return res.status(404).json({ error: "Meeting not found" });
    return res.json({ data: i });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const items = await meetingsService.getAll(req.query);
    return res.json({ data: items });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const created = await meetingsService.create(req.body, userId);
    return res.status(201).json({ data: created });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const userId = req.user.user_id;
    const updated = await meetingsService.update(
      req.params.id,
      req.body,
      userId
    );
    return res.json({ data: updated });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.archive = async (req, res, next) => {
  try {
    await meetingsService.archive(req.params.id);
    return res.status(200).json({ message: "Data removed" });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.searchMeetings = async (req, res, next) => {
  try {
    const items = await meetingsService.searchMeetings(req.query);
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
