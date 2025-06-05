const redisClient = require("../config/redisClient");

module.exports = async (req, res, next) => {
  const cacheKey = `chapters:${JSON.stringify(req.query)}`;

  try {
    const cached = await redisClient.get(cacheKey);
    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Hook into res.json to cache after controller sends response
    const originalJson = res.json.bind(res);
    res.json = (data) => {
      redisClient.setEx(cacheKey, 3600, JSON.stringify(data)); // TTL: 1 hour
      return originalJson(data);
    };

    next();
  } catch (err) {
    console.error("Redis cache error:", err.message);
    next(); // fallback to DB if cache fails
  }
};
