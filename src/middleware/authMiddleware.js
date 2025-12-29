// middleware/authMiddleware.js
const { verifyToken } = require("../utils/jwtUtils");

const authenticate = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "Authorization missing" });

    const [type, token] = header.split(" ");
    if (type !== "Bearer") return res.status(401).json({ error: "Invalid token" });

    req.user = verifyToken(token);
    next();
  } catch (err) {
    res.status(401).json({ error: err.message });
  }
};

module.exports = { authenticate };
