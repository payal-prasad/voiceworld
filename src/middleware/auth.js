const { verify } = require("../utils/jwt");
const { AuthError } = require("../errors");

// Basic authentication middleware
const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next(new AuthError("No token provided"));

  try {
    req.user = verify(token);
    next();
  } catch (e) {
    next(new AuthError("Invalid token"));
  }
};

// Role-based authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) return next(new AuthError("Authentication required"));

    if (!roles.includes(req.user.role)) {
      return next(new AuthError("Insufficient permissions"));
    }

    next();
  };
};

// Specific role middlewares
const requireUser = authorize("user", "admin");
const requirePartner = authorize("partner", "admin");
const requireAdmin = authorize("admin");

// Combined middleware for different roles
const requireUserOrPartner = authorize("user", "partner", "admin");

module.exports = {
  authenticate,
  authorize,
  requireUser,
  requirePartner,
  requireAdmin,
  requireUserOrPartner,
};
