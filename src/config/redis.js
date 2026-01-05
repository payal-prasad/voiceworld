// services/industry-service/config/redis.js
const IORedis = require("ioredis");

const redisHost = process.env.REDIS_HOST || "127.0.0.1";
const redisPort = parseInt(process.env.REDIS_PORT || "6379", 10);
const redisPassword = process.env.REDIS_PASSWORD;
const redis = new IORedis({
  host: redisHost,
  port: redisPort,
  password: redisPassword,
});

redis.on("connect", () => console.log("Redis client connected"));
redis.on("error", (err) => console.warn("Redis error", err.message || err));
redis.on("close", () => console.log("Redis connection closed"));

module.exports = redis;
