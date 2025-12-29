// services/userService.js
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const User = require("../models/user");
const { generateToken } = require("../utils/jwtUtils");

exports.registerUser = async (data) => {
  const exists = await User.findOne({ where: { email: data.email } });
  if (exists) throw new Error("Email already registered");

  const user = await User.create({
    name: data.name,
    email: data.email,
    password_hash: await bcrypt.hash(data.password, 10),
    avatar_url: data.avatar_url || null,
  });

  const token = generateToken({ id: user.id, role: user.role });

  return { token, user };
};

exports.getAllUsers = async () => {
  return User.findAll({ attributes: { exclude: ["password_hash"] } });
};

exports.getUserById = async (id) => {
  const user = await User.findByPk(id, { attributes: { exclude: ["password_hash"] } });
  if (!user) throw new Error("User not found");
  return user;
};

exports.updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  await user.update(data);
  return user;
};

exports.deleteUser = async (id) => {
  const user = await User.findByPk(id);
  if (!user) throw new Error("User not found");
  await user.update({ is_active: false });
};

exports.searchUsers = async (criteria) => {
  const where = {};
  if (criteria.name) where.name = { [Op.iLike]: `%${criteria.name}%` };
  if (criteria.email) where.email = { [Op.iLike]: `%${criteria.email}%` };
  return User.findAll({ where, attributes: { exclude: ["password_hash"] } });
};
