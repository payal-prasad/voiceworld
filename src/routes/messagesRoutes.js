const express = require("express");
const controller = require("../controllers/messagesController");
const { authenticate } = require("../middleware/auth");
const {
  decryptPayloadMiddleware,
  encryptResponseMiddleware,
} = require("../middleware/encryptMiddleware");
const { cacheGet, cacheInvalidate } = require("../middleware/cacheMiddleware");

const router = express.Router();

// Action-based endpoints with versioning
router.get(
  "/getAllMessages/:id",
  authenticate,
  cacheGet((req) => `messages:${req.params.id}`),
  controller.getAll,
  encryptResponseMiddleware
);
router.post(
  "/sendMessage/:id",
  authenticate,
  decryptPayloadMiddleware,
  controller.send,
  encryptResponseMiddleware
);
router.delete(
  "/archiveMessage/:id",
  authenticate,
  controller.archive,
  encryptResponseMiddleware
);
router.get(
  "/searchMessagesByCriteria",
  authenticate,
  cacheGet("messages:search"),
  controller.searchMessages,
  encryptResponseMiddleware
);

module.exports = router;
