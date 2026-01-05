// OTP expires after 10 minutes (600 seconds)
const OTP_EXPIRY_SECONDS = 600;

// Check if Redis is disabled
const isRedisDisabled = process.env.DISABLE_REDIS === "1";

let redis = null;
let inMemoryStorage = new Map(); // Fallback storage

// Only initialize Redis if not disabled
if (!isRedisDisabled) {
  try {
    const Redis = require("ioredis");

    // Create Redis client
    redis = new Redis({
      host: process.env.REDIS_HOST || "127.0.0.1",
      port: process.env.REDIS_PORT || 6379,
      password: process.env.REDIS_PASSWORD,
      retryStrategy: (times) => {
        // Stop retrying after 3 attempts and fallback to in-memory
        if (times > 3) {
          console.warn(
            "Redis connection failed, falling back to in-memory storage"
          );
          redis = null;
          return null;
        }
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
    });

    redis.on("error", (err) => {
      console.error("Redis connection error:", err);
    });

    redis.on("connect", () => {
      console.log("Redis connected successfully");
    });
  } catch (error) {
    console.warn(
      "Redis not available, using in-memory storage:",
      error.message
    );
    redis = null;
  }
}

// Cleanup expired OTPs from in-memory storage
if (!redis) {
  console.log("Using in-memory OTP storage (suitable for development only)");
  setInterval(() => {
    const now = Date.now();
    for (const [key, data] of inMemoryStorage.entries()) {
      if (now > data.expiresAt) {
        inMemoryStorage.delete(key);
      }
    }
  }, 5 * 60 * 1000); // Clean up every 5 minutes
}

/**
 * Store OTP in Redis with automatic expiration
 * @param {string} mobileNumber - Mobile number
 * @param {string} otp - OTP code
 * @param {object} registrationData - Registration data (optional)
 */
exports.storeOTP = async (mobileNumber, otp, registrationData = {}) => {
  try {
    const key = `otp:registration:${mobileNumber}`;
    const data = {
      otp,
      timestamp: Date.now(),
      expiresAt: Date.now() + OTP_EXPIRY_SECONDS * 1000,
      registrationData,
    };

    if (redis) {
      // Store in Redis with 10-minute expiration
      await redis.setex(key, OTP_EXPIRY_SECONDS, JSON.stringify(data));
      console.log(`OTP stored in Redis for mobile: ${mobileNumber}`);
    } else {
      // Store in memory
      inMemoryStorage.set(key, data);
      console.log(`OTP stored in memory for mobile: ${mobileNumber}`);
    }
  } catch (error) {
    console.error("Error storing OTP:", error);
    throw error;
  }
};

/**
 * Get OTP from Redis
 * @param {string} mobileNumber - Mobile number
 * @returns {object|null} - OTP data or null if not found/expired
 */
exports.getOTP = async (mobileNumber) => {
  try {
    const key = `otp:registration:${mobileNumber}`;

    if (redis) {
      // Get from Redis
      const data = await redis.get(key);
      if (!data) {
        return null;
      }
      return JSON.parse(data);
    } else {
      // Get from memory
      const data = inMemoryStorage.get(key);
      if (!data) {
        return null;
      }
      // Check if expired
      if (Date.now() > data.expiresAt) {
        inMemoryStorage.delete(key);
        return null;
      }
      return data;
    }
  } catch (error) {
    console.error("Error getting OTP:", error);
    return null;
  }
};

/**
 * Remove OTP from Redis
 * @param {string} mobileNumber - Mobile number
 */
exports.removeOTP = async (mobileNumber) => {
  try {
    const key = `otp:registration:${mobileNumber}`;

    if (redis) {
      await redis.del(key);
      console.log(`OTP removed from Redis for mobile: ${mobileNumber}`);
    } else {
      inMemoryStorage.delete(key);
      console.log(`OTP removed from memory for mobile: ${mobileNumber}`);
    }
  } catch (error) {
    console.error("Error removing OTP:", error);
  }
};

/**
 * Check if OTP exists for mobile number
 * @param {string} mobileNumber - Mobile number
 * @returns {boolean} - True if OTP exists
 */
exports.otpExists = async (mobileNumber) => {
  try {
    const key = `otp:registration:${mobileNumber}`;

    if (redis) {
      const exists = await redis.exists(key);
      return exists === 1;
    } else {
      const data = inMemoryStorage.get(key);
      if (!data) {
        return false;
      }
      // Check if expired
      if (Date.now() > data.expiresAt) {
        inMemoryStorage.delete(key);
        return false;
      }
      return true;
    }
  } catch (error) {
    console.error("Error checking OTP existence:", error);
    return false;
  }
};

/**
 * Get remaining TTL for OTP
 * @param {string} mobileNumber - Mobile number
 * @returns {number} - Remaining seconds, -1 if not found, -2 if no expiry
 */
exports.getOTPTTL = async (mobileNumber) => {
  try {
    const key = `otp:registration:${mobileNumber}`;

    if (redis) {
      const ttl = await redis.ttl(key);
      return ttl;
    } else {
      const data = inMemoryStorage.get(key);
      if (!data) {
        return -2; // Key does not exist
      }
      const remainingMs = data.expiresAt - Date.now();
      if (remainingMs <= 0) {
        inMemoryStorage.delete(key);
        return -2; // Expired
      }
      return Math.floor(remainingMs / 1000); // Return seconds
    }
  } catch (error) {
    console.error("Error getting OTP TTL:", error);
    return -2;
  }
};

/**
 * Store mobile verification status
 * @param {string} mobileNumber - Mobile number
 */
exports.storeMobileVerified = async (mobileNumber) => {
  try {
    const key = `mobile:verified:${mobileNumber}`;
    const data = {
      verified: true,
      verifiedAt: Date.now(),
    };

    if (redis) {
      // Store verification status for 24 hours
      await redis.setex(key, 86400, JSON.stringify(data));
      console.log(`Mobile verification stored in Redis for: ${mobileNumber}`);
    } else {
      // Store in memory with 24-hour expiration
      inMemoryStorage.set(key, { ...data, expiresAt: Date.now() + 86400000 });
      console.log(`Mobile verification stored in memory for: ${mobileNumber}`);
    }
  } catch (error) {
    console.error("Error storing mobile verification:", error);
    throw error;
  }
};

/**
 * Check if mobile number is verified
 * @param {string} mobileNumber - Mobile number
 * @returns {boolean} - True if mobile is verified
 */
exports.isMobileVerified = async (mobileNumber) => {
  try {
    const key = `mobile:verified:${mobileNumber}`;

    if (redis) {
      const exists = await redis.exists(key);
      return exists === 1;
    } else {
      const data = inMemoryStorage.get(key);
      if (!data) {
        return false;
      }
      // Check if expired
      if (Date.now() > data.expiresAt) {
        inMemoryStorage.delete(key);
        return false;
      }
      return data.verified === true;
    }
  } catch (error) {
    console.error("Error checking mobile verification:", error);
    return false;
  }
};

/**
 * Remove mobile verification status
 * @param {string} mobileNumber - Mobile number
 */
exports.removeMobileVerified = async (mobileNumber) => {
  try {
    const key = `mobile:verified:${mobileNumber}`;

    if (redis) {
      await redis.del(key);
      console.log(
        `Mobile verification removed from Redis for: ${mobileNumber}`
      );
    } else {
      inMemoryStorage.delete(key);
      console.log(
        `Mobile verification removed from memory for: ${mobileNumber}`
      );
    }
  } catch (error) {
    console.error("Error removing mobile verification:", error);
  }
};

module.exports.redis = redis;
