const { encrypt } = require("../utils/encryption");

module.exports = () => (req, res, next) => {
  const oldSend = res.send;
  const oldJson = res.json;

  // Override res.send
  res.send = function (body) {
    if (body && typeof body === "object" && !body.encryptedPayload) {
      const encrypted = encrypt(JSON.stringify(body));
      oldSend.call(this, JSON.stringify({ encryptedPayload: encrypted }));
    } else {
      oldSend.call(this, body);
    }
  };

  // Override res.json
  res.json = function (body) {
    if (body && typeof body === "object" && !body.encryptedPayload) {
      const encrypted = encrypt(JSON.stringify(body));
      oldJson.call(this, { encryptedPayload: encrypted });
    } else {
      oldJson.call(this, body);
    }
  };

  next();
};
