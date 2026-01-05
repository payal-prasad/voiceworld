const { decrypt } = require('../utils/encryption');
const { ValidationError } = require('../errors');

module.exports = (req, res, next) => {
  if (req.body.encryptedPayload) {
    try {
      req.body = JSON.parse(decrypt(req.body.encryptedPayload));
    } catch (e) {
      return next(new ValidationError('Invalid encrypted payload'));
    }
  }
  next();
};