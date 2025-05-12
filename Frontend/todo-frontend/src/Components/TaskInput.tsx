import { useState } from 'react';

interface Props {
  onAddTask: (title: string) => void;
}

const TaskInput = ({ onAddTask }: Props) => {
  const [task, setTask] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (task.trim()) {
      onAddTask(task);
      setTask('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2 mb-4" style={{}}>
      <input
        type="text"
        value={task}
        onChange={(e) => setTask(e.target.value)}
        placeholder="Enter your task..."
         className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring focus:border-blue-300"
         style={{padding:'4px',margin:'5px'}}
      />
      <button className="bg-[#883B0F] hover:bg-[#6f2f0d] text-white px-4 py-2 rounded-md font-semibold" style={{padding:'8px 10px'}}>
      ➕ Add
      </button>
    </form>
  );
};

export default TaskInput;
