// routes/userRoutes.js
const express = require("express");
const ctrl = require("../controllers/userController");
const { authenticate } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", ctrl.register);

router.get("/", authenticate, ctrl.getAll);
router.get("/search", authenticate, ctrl.search);
router.get("/:id", authenticate, ctrl.getById);
router.put("/:id", authenticate, ctrl.update);
router.delete("/:id", authenticate, ctrl.delete);

module.exports = router;
