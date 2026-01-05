const express = require("express");
const controller = require("../controllers/usersController");
const { authenticate } = require("../middleware/auth");
const {
  decryptPayloadMiddleware,
  encryptResponseMiddleware,
} = require("../middleware/encryptMiddleware");
const { cacheGet, cacheInvalidate } = require("../middleware/cacheMiddleware");

const router = express.Router();

// Action-based endpoints with versioning
router.get(
  "/getAllUsers",
  cacheGet("users:all"),
  controller.getAll,
  encryptResponseMiddleware
);
router.get(
  "/getUserById/:id",
  cacheGet((req) => `users:${req.params.id}`),
  controller.getById,
  encryptResponseMiddleware
);
router.post(
  "/register",
  decryptPayloadMiddleware,
  controller.create,
  encryptResponseMiddleware
);
router.post(
  "/login",
  decryptPayloadMiddleware,
  controller.login,
  encryptResponseMiddleware
);
router.get(
  "/profile",
  authenticate,
  controller.getProfile,
  encryptResponseMiddleware
);
router.put(
  "/updateUser/:id",
  decryptPayloadMiddleware,
  cacheInvalidate("users:all"),
  controller.update,
  encryptResponseMiddleware
);
router.delete(
  "/archiveUser/:id",
  controller.archive,
  encryptResponseMiddleware
);
router.get(
  "/searchUsersByCriteria",
  cacheGet("users:search"),
  controller.searchUsers,
  encryptResponseMiddleware
);

module.exports = router;
