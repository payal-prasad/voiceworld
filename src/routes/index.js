const router = require("express").Router();
const {
  authenticate,
  requireUser,
  requireUserOrPartner,
} = require("../middleware/auth");
const decrypt = require("../middleware/decrypt");
const encrypt = require("../middleware/encrypt")();

// Public test endpoint (no auth, no encrypt for debug)
router.get("/ping", (req, res) => res.json({ message: "API alive!" }));

// VideoSDK token generation (public)
router.get("/get-token", (req, res) => {
  const jwt = require("jsonwebtoken");
  const API_KEY = "64fb9cce-2afc-434a-afc1-838f7c2c99d4";
  const SECRET_KEY = "56c5562b18d989267582c6a905a569768afbdee058ac5d7b820f879e47a3724c";
  const options = {
    expiresIn: "120m",
    algorithm: "HS256",
  };
  const payload = {
    apikey: API_KEY,
    permissions: ["allow_join", "allow_mod"],
  };
  const token = jwt.sign(payload, SECRET_KEY, options);
  res.json({ token });
});

// OTP routes (public)
router.post(
  "/login/send-otp",
  require("../controllers/usersController").sendOTP
);
router.post(
  "/login/verify-otp",
  require("../controllers/usersController").verifyOTP
);

// Registration and login routes (public)
router.post("/register", require("../controllers/usersController").register);
router.post("/login", require("../controllers/usersController").login);

// Protected routes with authentication
// router.use(authenticate);

// User routes (users can access their own data)
router.use("/users", require("./usersRoutes"));

// Meeting routes
router.use("/meetings", require("./meetingsRoutes"));
router.use("/participants", require("./participantsRoutes"));
router.use("/messages", require("./messagesRoutes"));
router.use("/invites", require("./invitesRoutes"));

// router.use(decrypt);
// router.use(encrypt);

module.exports = router;
