const express = require("express");
const controller = require("../controllers/participantController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, controller.create);
router.get("/meeting/:meetingId", authenticate, controller.getAllByMeeting);
router.put("/:id", authenticate, controller.update);

module.exports = router;
