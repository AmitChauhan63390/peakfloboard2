import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Tasks, Id } from '../types';
import TrashIcon from '../icons/TrashIcon';

interface TaskCardProps {
  task: Tasks;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, updatedTask: Partial<Tasks>) => void;
}

const TaskCard = ({ task, deleteTask, updateTask }: TaskCardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);
  const [editedDescription, setEditedDescription] = useState(task.description || '');

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'Task',
      task,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  const handleSaveEdit = () => {
    updateTask(task.id, { 
      title: editedTitle, 
      description: editedDescription 
    });
    setIsEditing(false);
  };

  const handleStatusChange = (newStatus: 'todo' | 'in-progress' | 'done') => {
    updateTask(task.id, { status: newStatus });
  };

  const getStatusColor = () => {
    switch (task.status) {
      case 'todo':
        return 'bg-gray-500';
      case 'in-progress':
        return 'bg-yellow-500';
      case 'done':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-60 bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] flex items-center text-left rounded-xl border-2 border-rose-500 cursor-grab"
      />
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-mainBackgroundColor p-2.5 h-[100px] min-h-[100px] flex items-center text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 cursor-grab relative"
    >
      {!isEditing ? (
        <div className="flex w-full gap-2 justify-between items-start">
          <div className="flex flex-col w-full">
            <div className="flex justify-between w-full items-center">
              <p className="text-white">{task.title}</p>
              <button 
                onClick={() => deleteTask(task.id)}
                className="text-gray-500 hover:text-white"
              >
                <TrashIcon />
              </button>
            </div>
            {task.description && (
              <p className="text-sm text-gray-400 mt-1">{task.description}</p>
            )}
            <div className="mt-2 flex items-center justify-between">
              <span 
                className={`text-xs px-2 py-1 rounded ${getStatusColor()} text-white`}
                onClick={() => setIsEditing(true)}
              >
                {task.status === 'todo' ? 'To Do' : 
                 task.status === 'in-progress' ? 'In Progress' : 'Done'}
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full space-y-2">
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full bg-black border border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 rounded px-2 py-1 text-white"
            placeholder="Task Title"
          />
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full bg-black border border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 rounded px-2 py-1 text-white"
            placeholder="Task Description"
            rows={2}
          />
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as 'todo' | 'in-progress' | 'done')}
            className="w-full bg-black border border-rose-500 focus:outline-none focus:ring-2 focus:ring-rose-500 rounded px-2 py-1 text-white"
          >
            <option value="todo">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="done">Done</option>
          </select>
          <div className="flex justify-end space-x-2 mt-2">
            <button
              onClick={() => setIsEditing(false)}
              className="px-2 py-1 border-2 border-commonBackgroundColor rounded-md text-white hover:bg-mainBackgroundColor"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveEdit}
              className="px-2 py-1 bg-rose-500 text-white rounded-md hover:bg-rose-600"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskCard;