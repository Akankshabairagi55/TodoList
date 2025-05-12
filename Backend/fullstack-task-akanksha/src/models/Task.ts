import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
 
  date: {
    type: Date,
    default: Date.now
  }
});

// 📖 Tell MongoDB: “These are the kind of documents I’ll save”
export const Task = mongoose.model('Task', TaskSchema, 'assignment_Akanksha');
