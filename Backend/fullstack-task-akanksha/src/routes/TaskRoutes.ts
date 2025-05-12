import express from 'express';
import { Request, Response } from 'express';
import redisClient from '../redis'; // Redis client
import { Task } from '../models/Task'; // Mongoose model

const router = express.Router();


const redisKey = 'FULLSTACK_TASK_Akanksha';

// ➕ Add New Task
router.post('/addTask', async (req: Request, res: Response) => {
  try {
    const { title } = req.body;
    const cachedTasks = await redisClient.get(redisKey);
    const taskList = cachedTasks ? JSON.parse(cachedTasks) : [];

    const newTask = { title };
    taskList.push(newTask);

    if (taskList.length > 50) {
      await Task.insertMany(taskList);
      await redisClient.del(redisKey);
      console.log('🎯 Moved tasks to MongoDB and cleared Redis cache');
    } else {
      await redisClient.set(redisKey, JSON.stringify(taskList));
      console.log('🧠 Task stored in Redis');
    }

    res.status(201).json({ message: 'Task processed!', task: newTask });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add task' });
  }
});
// fetch
router.get('/fetchAllTasks', async (_req: Request, res: Response) => {
  try {
    let redisTasks = [];

    try {
      const cachedTasks = await redisClient.get(redisKey);
      redisTasks = cachedTasks ? JSON.parse(cachedTasks) : [];
    } catch (redisErr) {
      console.error('⚠️ Redis read or parse failed:', redisErr.message);
      redisTasks = []; // fallback to empty
    }

    const mongoTasks = await Task.find();

    res.json({
      fromRedis: redisTasks,
      fromMongoDB: mongoTasks
    });
  } catch (err) {
    console.error('❌ fetchAllTasks Error:', err.message);
    res.status(500).json({ error: 'Failed to fetch tasks' });
  }
});





export default router;
