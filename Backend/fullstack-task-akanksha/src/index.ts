import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import 'dotenv/config';
import redisClient from './redis'; // Redis client
import taskRoutes from './routes/TaskRoutes';
import mqtt from 'mqtt';
import { Task } from './models/Task';

// Connect to MQTT Broker
const client = mqtt.connect('mqtt://broker.hivemq.com');

const app = express();
app.use(cors());
app.use(express.json());
app.use('/', taskRoutes);

const PORT = process.env.PORT || 4000;
const MONGO_URI = process.env.MONGO_URI as string;
const redisKey = 'FULLSTACK_TASK_Akanksha';
const request_topic = 'add/task';

// ✅ Connect to MongoDB
mongoose
  .connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB!'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ✅ MQTT Connection & Subscription
client.on('connect', () => {
  console.log('🔌 MQTT connected on backend');

  client.subscribe(request_topic, (err) => {
    if (!err) {
      console.log(`📩 Subscribed to topic: ${request_topic}`);
    } else {
      console.error('❌ MQTT Subscription error:', err);
    }
  });

  // Optional: you can publish something once connected
  // client.publish(request_topic, JSON.stringify({ task: "Hello from backend", date: Date.now() }));
});

// ✅ Handle MQTT messages
// client.on('message', async (topic, message) => {
//   await redisClient.del(redisKey);
//   if (topic === request_topic) {
//     try {
//       const cachedTasks = await redisClient.get(redisKey);
//       const taskList = cachedTasks ? JSON.parse(cachedTasks) : [];

//       const newTask = JSON.parse(message.toString());
//       console.log(cachedTasks)
//       // Push formatted task object
//       taskList.push({title:newTask.task, date:newTask.date});
      
//       if (taskList.length > 2) {
//         await Task.insertMany(taskList);
//         await redisClient.del(redisKey);
//         console.log('🎯 Moved tasks to MongoDB and cleared Redis cache');
//       } else {
//         await redisClient.set(redisKey, JSON.stringify(taskList));
//         console.log('🧠 Task stored in Redis');
//       }

//     } catch (err) {
//       console.error('❌ Error processing MQTT message:', err);
//     }
//   }
// });
client.on('message', async (topic, message) => {
  if (topic === request_topic) {
    try {
      const cachedTasks = await redisClient.get(redisKey);
      const taskList = cachedTasks ? JSON.parse(cachedTasks) : [];

      const newTask = JSON.parse(message.toString());
      console.log("Cached Tasks Before:", taskList);
      console.log(cachedTasks)

      // Push formatted task object
      taskList.push({ title: newTask.task, date: newTask.date });

      if (taskList.length > 50) {
        await Task.insertMany(taskList);
        await redisClient.del(redisKey);
        console.log('🎯 Moved tasks to MongoDB and cleared Redis cache');
      } else {
        await redisClient.set(redisKey, JSON.stringify(taskList));
        console.log('🧠 Task stored in Redis');
      }

    } catch (err) {
      console.error('❌ Error processing MQTT message:', err);
    }
  }
});


// 🚀 Start the server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
