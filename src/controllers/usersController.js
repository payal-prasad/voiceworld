const usersService = require("../services/usersService");
const BusinessException = require("../exceptions/businessException");
const Users = require("../models/Users");

exports.getById = async (req, res, next) => {
  try {
    const i = await usersService.getById(req.params.id);
    if (!i) return res.status(404).json({ error: "User not found" });
    return res.json({ data: i });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.getAll = async (req, res, next) => {
  try {
    const items = await usersService.getAll(req.query);
    return res.json({ data: items });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const created = await usersService.create(req.body);
    return res.status(201).json({ data: created });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const updated = await usersService.update(req.params.id, req.body);
    return res.json({ data: updated });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.archive = async (req, res, next) => {
  try {
    await usersService.archive(req.params.id);
    return res.status(200).json({ message: "Data removed" });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const result = await usersService.login(req.body);
    return res.json({ data: result });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const id = req.user.id;
    const i = await usersService.getById(id);
    if (!i) return res.status(404).json({ error: "User not found" });
    return res.json({ data: i });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.searchUsers = async (req, res, next) => {
  try {
    const items = await usersService.searchUsers(req.query);
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

exports.register = async (req, res, next) => {
  try {
    const created = await usersService.create(req.body);
    return res.status(201).json({ data: created });
  } catch (err) {
    if (err instanceof BusinessException) {
      return res.status(err.status).json({ error: err.message });
    }
    // Handle Sequelize validation errors
    if (
      err.name === "SequelizeValidationError" ||
      err.name === "SequelizeUniqueConstraintError"
    ) {
      return res.status(400).json({ error: "Email id already exist" });
    }
    next(err);
  }
};

exports.sendOTP = async (req, res, next) => {
  try {
    const { error } = require("../validations/usersValidation").validateSendOTP(
      req.body
    );
    if (error) throw new BusinessException(error.details[0].message);

    const { email } = req.body;

    const otp = require("../utils/otpService").generateOTP();
    await require("../utils/redisOTPStorage").storeOTP(email, otp);

    // For now, just return the OTP (in production, send via email)
    console.log(`OTP for ${email}: ${otp}`);
    return res.json({ message: "OTP sent successfully", otp }); // Remove otp in response for production
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { error } =
      require("../validations/usersValidation").validateVerifyOTP(req.body);
    if (error) throw new BusinessException(error.details[0].message);

    const { email, otp } = req.body;

    const isValid = await require("../utils/redisOTPStorage").verifyOTP(
      email,
      otp
    );
    if (!isValid) throw new BusinessException("Invalid or expired OTP");

    // Find user and generate token
    const user = await usersService.getByEmail(email);
    if (!user) throw new BusinessException("User not found");

    const token = require("jsonwebtoken").sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "24h" }
    );
    return res.json({ data: { token, user } });
  } catch (err) {
    if (err instanceof BusinessException)
      return res.status(err.status).json({ error: err.message });
    next(err);
  }
};
