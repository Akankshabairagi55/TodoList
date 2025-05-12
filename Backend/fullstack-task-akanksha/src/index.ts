import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import redisClient from './redis'; // Redis client
import taskRoutes from './routes/TaskRoutes';



const app = express();
app.use(cors());
app.use(express.json());
app.use('/', taskRoutes);

const PORT = process.env.PORT || 8080;
const MONGO_URI = process.env.MONGO_URI as string;
console.log(MONGO_URI)

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ Connect to Redis
redisClient.on('connect', () => {
  console.log('✅ Connected to Redis!');
});

redisClient.on('error', (err) => {
  console.error('❌ Redis connection error:', err);
});

// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
