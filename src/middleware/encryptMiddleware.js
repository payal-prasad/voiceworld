const encrypt = require("./encrypt");

const decryptPayloadMiddleware = (req, res, next) => {
  // Decrypt request body if needed
  next();
};

const encryptResponseMiddleware = (req, res, next) => {
  // Encrypt response if needed
  next();
};

module.exports = {
  decryptPayloadMiddleware,
  encryptResponseMiddleware,
};
