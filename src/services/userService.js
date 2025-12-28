const bcrypt = require("bcrypt");
const User = require("../models/user");

exports.registerUser = async (userData) => {
  const existingUser = await User.findOne({
    where: { email: userData.email },
  });

  if (existingUser) {
    throw new Error("Email already registered");
  }

  const hashedPassword = await bcrypt.hash(userData.password, 10);

  const user = await User.create({
    name: userData.name,
    email: userData.email,
    password_hash: hashedPassword,
    avatar_url: userData.avatar_url || null,
    role: "user",
    is_active: true,
  });

  return user;
};

exports.getAllUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ["password_hash"] },
  });
};
