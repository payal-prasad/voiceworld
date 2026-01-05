const Users = require("../models/Users");
const BusinessException = require("../exceptions/businessException");
const validateUsers = require("../validations/usersValidation");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { Op } = require("sequelize");

exports.getAll = async (query = {}) => {
  const items = await Users.findAll({
    where: { is_active: true },
    limit: 100,
  });
  return items.map((i) => i.toJSON());
};

exports.getByEmail = async (email) => {
  const item = await Users.findOne({
    where: {
      email: email,
      is_active: true,
    },
  });
  if (!item) return null;
  return item.toJSON();
};

exports.create = async (payload) => {
  const { error } = validateUsers(payload);
  if (error) throw new BusinessException(error.details[0].message);

  // Check if email already exists (any status)
  const existingUser = await Users.findOne({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new BusinessException("Email id already exist");
  }

  // Hash password
  payload.password_hash = await bcrypt.hash(payload.password, 10);
  delete payload.password;

  // Generate unique user_id
  let userId;
  do {
    userId =
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15);
  } while (await Users.findOne({ where: { user_id: userId } }));
  payload.user_id = userId;

  if (!payload.createdAt) payload.createdAt = new Date();
  const created = await Users.create(payload);
  return created.toJSON();
};

exports.update = async (id, updates) => {
  const item = await Users.findOne({
    where: {
      id: id,
      is_active: true,
    },
  });
  if (!item) throw new BusinessException("User not found");
  const { error } = validateUsers(updates);
  if (error) throw new BusinessException(error.details[0].message);

  if (updates.password) {
    updates.password_hash = await bcrypt.hash(updates.password, 10);
    delete updates.password;
  }

  await item.update(updates);
  return item.toJSON();
};

exports.archive = async (id) => {
  const item = await Users.findByPk(id);
  if (!item) throw new BusinessException("User not found");
  await item.update({ is_active: false });
};

exports.login = async (payload) => {
  const { error } = validateUsers.validateLogin(payload);
  if (error) throw new BusinessException(error.details[0].message);

  const user = await Users.findOne({
    where: { email: payload.email, is_active: true },
  });
  if (!user) throw new BusinessException("Invalid email or password");

  const isValid = await bcrypt.compare(payload.password, user.password_hash);
  if (!isValid) throw new BusinessException("Invalid email or password");

  const token = jwt.sign(
    { id: user.id, user_id: user.user_id, email: user.email },
    process.env.JWT_SECRET || "secret",
    { expiresIn: "24h" }
  );
  return { token, user: user.toJSON() };
};

exports.searchUsers = async (criteria) => {
  const { error } = validateUsers.validateSearchCriteria(criteria);
  if (error) throw new BusinessException(error.details[0].message);
  const whereClause = { is_active: true };
  if (criteria.email) whereClause.email = { [Op.like]: `%${criteria.email}%` };
  if (criteria.name) whereClause.name = { [Op.like]: `%${criteria.name}%` };
  if (criteria.role) whereClause.role = criteria.role;
  const items = await Users.findAll({ where: whereClause });
  return items.map((i) => i.toJSON());
};
