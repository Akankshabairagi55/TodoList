import type  { Task } from '../types';

interface Props {
  tasks: Task[];
}

const TaskList: React.FC<Props> = ({ tasks }) => {
  return (
    <div className="overflow-y-auto max-h-60 custom-scrollbar" style={{padding:'10px'}} >
  <h2 className="text-lg font-semibold mb-2">Notes</h2>
    <ul className="space-y-2">
      {tasks.map((task) => (
        <li key={task.id} className="border-b pb-2" style={{padding:'10px'}}>
          <span className="font-medium">{task.title}</span>
          <br />
          <small className="text-gray-600 text-sm">
            {new Date(task.createdAt).toLocaleString()}
          </small>
        </li>
      ))}
    </ul>
    </div>
  );
};

export default TaskList;
