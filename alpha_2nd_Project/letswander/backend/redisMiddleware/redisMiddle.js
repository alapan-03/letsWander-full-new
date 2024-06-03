const redis = require("redis");

require('dotenv').config();

// console.log(process.env.REDIS_PASSWORD)
// Get Redis connection details from environment variables
const redisHost = process.env.REDIS_HOST || 'localhost';
const redisPort = process.env.REDIS_PORT || 6379;
const redisPassword = process.env.REDIS_PASSWORD;

// Initialize Redis client with connection details
const client = redis.createClient({
    // url: `redis://${redisPassword ? `:${redisPassword}@` : ''}${redisHost}:${redisPort}`
    url: `redis://:${redisPassword}@redis-17325.c264.ap-south-1-1.ec2.redns.redis-cloud.com:17325`
});
client.on("error", (err) => {
    console.error("Redis error: ", err);
});

// Connect to Redis when the application starts
client.connect().catch(console.error);

module.exports = client;
