const redisClient = require("../config/redisClient");

const WINDOW_SIZE_IN_MINUTES = 1;
const MAX_REQUESTS = 30;

module.exports = async (req, res, next) => {
  try {
    const ip = req.ip || req.connection.remoteAddress;
    const key = `ratelimit:${ip}`;
    const ttl = WINDOW_SIZE_IN_MINUTES * 60;

    const current = await redisClient.get(key);

    if (current && parseInt(current) >= MAX_REQUESTS) {
      return res.status(429).json({
        error: "Too many requests. Please try again later.",
      });
    }

    if (current) {
      await redisClient.incr(key);
    } else {
      await redisClient.setEx(key, ttl, '1'); // set new with 1 minute TTL
    }

    next();
  } catch (err) {
    console.error("Rate limiter error:", err.message);
    next(); // fallback — don’t block request
  }
};
