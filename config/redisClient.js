const redis = require("redis");
require("dotenv").config();
console.log("Using Redis URL:", process.env.REDIS_URL); // Debugging line
const redisClient = redis.createClient({
  url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => console.error("Redis Client Error", err));
redisClient.connect();

module.exports = redisClient;
