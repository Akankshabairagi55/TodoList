import { useState,useEffect } from 'react';
// import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import Header from './Components/Header';
import TaskInput from './Components/TaskInput';
import TaskList from './Components/TaskList';
import type { Task } from './types';
import './index.css'


function App() {
  const [tasks, setTasks] = useState<Task[]>([]);


  const fetchTasks = async () => {
    const res = await fetch('https://todolist-1-wger.onrender.com/fetchAllTasks');
    const data = await res.json();
  console.log(data)
    const allTasks = [
      ...data.fromRedis,
      ...data.fromMongoDB,
    ];
  
    const converted: Task[] = allTasks.map((task: any) => ({
      id: crypto.randomUUID(),
      title: task.title,
      createdAt: new Date(task.createdAt),
    }));
    
  
    setTasks(converted.reverse());
  };
  
  useEffect(() => {
    fetchTasks();
  }, []);
  

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4" >
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-white rounded-xl shadow-md p-6"
        style={{padding:'20px'}}
      >
        <Header />
        <TaskInput/>
        <TaskList tasks={tasks} />
      </motion.div>
    </div>
  );
}

export default App;
