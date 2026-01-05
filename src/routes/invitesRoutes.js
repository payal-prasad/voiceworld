const express = require("express");
const controller = require("../controllers/invitesController");
const { authenticate } = require("../middleware/auth");
const {
  decryptPayloadMiddleware,
  encryptResponseMiddleware,
} = require("../middleware/encryptMiddleware");
const { cacheGet, cacheInvalidate } = require("../middleware/cacheMiddleware");

const router = express.Router();

// Action-based endpoints with versioning
router.get(
  "/getAllInvites/:id",
  authenticate,
  cacheGet((req) => `invites:${req.params.id}`),
  controller.getAll,
  encryptResponseMiddleware
);
router.post(
  "/sendInvite/:id",
  authenticate,
  decryptPayloadMiddleware,
  controller.send,
  encryptResponseMiddleware
);
router.delete(
  "/archiveInvite/:id",
  authenticate,
  controller.archive,
  encryptResponseMiddleware
);
router.get(
  "/searchInvitesByCriteria",
  authenticate,
  cacheGet("invites:search"),
  controller.searchInvites,
  encryptResponseMiddleware
);

module.exports = router;
