import { createClient } from 'redis';
import 'dotenv/config';

// 👇 Make sure the environment variable names match your .env file
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT), // Convert string to number
  },
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

// Optional: connect immediately
redisClient.connect();

export default redisClient;
