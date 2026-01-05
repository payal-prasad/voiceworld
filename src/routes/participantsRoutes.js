const express = require("express");
const controller = require("../controllers/participantsController");
const { authenticate } = require("../middleware/auth");
const {
  decryptPayloadMiddleware,
  encryptResponseMiddleware,
} = require("../middleware/encryptMiddleware");
const { cacheGet, cacheInvalidate } = require("../middleware/cacheMiddleware");

const router = express.Router();

// Action-based endpoints with versioning
router.get(
  "/getAllParticipants/:id",
  authenticate,
  cacheGet((req) => `participants:${req.params.id}`),
  controller.getAll,
  encryptResponseMiddleware
);
router.post(
  "/joinMeeting/:id",
  authenticate,
  decryptPayloadMiddleware,
  controller.join,
  encryptResponseMiddleware
);
router.put(
  "/updateParticipant/:id/:userId",
  authenticate,
  decryptPayloadMiddleware,
  cacheInvalidate((req) => `participants:${req.params.id}`),
  controller.update,
  encryptResponseMiddleware
);
router.delete(
  "/leaveMeeting/:id",
  authenticate,
  controller.leave,
  encryptResponseMiddleware
);
router.delete(
  "/archiveParticipant/:id",
  authenticate,
  controller.archive,
  encryptResponseMiddleware
);
router.put(
  "/muteParticipant/:id/:userId",
  authenticate,
  decryptPayloadMiddleware,
  cacheInvalidate((req) => `participants:${req.params.id}`),
  controller.muteParticipant,
  encryptResponseMiddleware
);
router.delete(
  "/kickParticipant/:id/:userId",
  authenticate,
  controller.kickParticipant,
  encryptResponseMiddleware
);

module.exports = router;
