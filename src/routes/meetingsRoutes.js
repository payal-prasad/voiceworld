const express = require("express");
const controller = require("../controllers/meetingsController");
const { authenticate } = require("../middleware/auth");
const {
  decryptPayloadMiddleware,
  encryptResponseMiddleware,
} = require("../middleware/encryptMiddleware");
const { cacheGet, cacheInvalidate } = require("../middleware/cacheMiddleware");

const router = express.Router();

// Action-based endpoints with versioning
router.get(
  "/getAllMeetings",
  authenticate,
  cacheGet("meetings:all"),
  controller.getAll,
  encryptResponseMiddleware
);
router.get(
  "/getMeetingById/:id",
  authenticate,
  cacheGet((req) => `meetings:${req.params.id}`),
  controller.getById,
  encryptResponseMiddleware
);
router.post(
  "/createMeeting",
  authenticate,
  decryptPayloadMiddleware,
  controller.create,
  encryptResponseMiddleware
);
router.put(
  "/updateMeeting/:id",
  authenticate,
  decryptPayloadMiddleware,
  cacheInvalidate("meetings:all"),
  controller.update,
  encryptResponseMiddleware
);
router.delete(
  "/archiveMeeting/:id",
  authenticate,
  controller.archive,
  encryptResponseMiddleware
);
router.get(
  "/searchMeetingsByCriteria",
  authenticate,
  cacheGet("meetings:search"),
  controller.searchMeetings,
  encryptResponseMiddleware
);

module.exports = router;
