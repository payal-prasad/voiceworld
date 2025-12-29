const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ALGO = "HS512";

if (!JWT_SECRET) {
  throw new Error("JWT_SECRET not set in environment");
}

const generateToken = (data) => {
  return jwt.sign(data, JWT_SECRET, {
    algorithm: JWT_ALGO,
  });
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET, {
      algorithms: [JWT_ALGO],
    });
  } catch (err) {
    const error = new Error("Unauthorized");
    error.status = 401;
    throw error;
  }
};

module.exports = {
  generateToken,
  verifyToken,
};
