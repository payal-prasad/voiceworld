require("dotenv").config({
  path: `.env.${process.env.NODE_ENV || "development"}`,
});
require("dotenv").config();
console.log("ENCRYPTION_KEY:", process.env.ENCRYPTION_KEY);
const dbConfig = require("./dbConfig");
const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 4000,

  // ---------- DB ----------
  db: dbConfig,

  // ---------- JWT ----------
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRE || "7d",
  },

  // ---------- SMTP ----------
  smtp: {
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },

  // ---------- Payment ----------
  payment: {
    key: process.env.PAYMENT_GATEWAY_KEY,
    secret: process.env.PAYMENT_GATEWAY_SECRET,
  },

  // ---------- File upload ----------
  upload: {
    maxSize: Number(process.env.MAX_FILE_SIZE),
    path: process.env.UPLOAD_PATH,
  },

  // ---------- Rate limit ----------
  rateLimit: {
    windowMs: Number(process.env.RATE_LIMIT_WINDOW) * 60 * 1000,
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS),
  },

  // ---------- Encryption ----------
  encryptionKey: process.env.ENCRYPTION_KEY
    ? Buffer.from(process.env.ENCRYPTION_KEY, "hex")
    : (() => {
        throw new Error("ENCRYPTION_KEY is required in .env");
      })(),
};

module.exports = config;
