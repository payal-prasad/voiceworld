// routes/meetingRoutes.js
const express = require("express");
const controller = require("../controllers/meetingController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, controller.create);
router.get("/", authenticate, controller.getAll);
router.get("/search", authenticate, controller.search);
router.get("/:id", authenticate, controller.getById);
router.put("/:id", authenticate, controller.update);
router.delete("/:id", authenticate, controller.delete);

module.exports = router;
