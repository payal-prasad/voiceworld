// controllers/userController.js
const service = require("../services/userService");
const { registerSchema, updateSchema } = require("../validations/userValidation");

exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const result = await service.registerUser(req.body);
    res.status(201).json(result);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.getAll = async (req, res) => res.json(await service.getAllUsers());
exports.getById = async (req, res) => res.json(await service.getUserById(req.params.id));
exports.update = async (req, res) => {
  const { error } = updateSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });
  res.json(await service.updateUser(req.params.id, req.body));
};
exports.delete = async (req, res) => {
  await service.deleteUser(req.params.id);
  res.json({ message: "User deactivated" });
};
exports.search = async (req, res) => res.json(await service.searchUsers(req.query));
