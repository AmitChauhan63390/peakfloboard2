import { useState } from "react";
import TrashIcon from "../icons/TrashIcon";
import EditIcon from "../icons/EditIcon"; // Import your edit icon
import { Id, Tasks } from "../types";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskCardProps {
  task: Tasks;
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, title: string) => void;
}

function TaskCard({ task, deleteTask, updateTask }: TaskCardProps) {
  const [mouseIsOver, setMouseIsOver] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title);

  const toggleEditMode = () => {
    setEditMode((prev) => !prev);
    setMouseIsOver(false);
  };

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
      type: "Task",
      task,
    },
    disabled: editMode,
  });

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      updateTask(task.id, editedTitle);
      toggleEditMode();
    }
  };

  if (editMode) {
    return (
      <div
        ref={setNodeRef}
        style={{ transition, transform: CSS.Transform.toString(transform) }}
        {...listeners}
        {...attributes}
        className="bg-mainBackgroundColor p-2.5 h-[120px] relative min-h-[100px] items-center flex text-left rounded-xl"
      >
        <input
          type="text"
          className="w-full h-full bg-transparent border-none outline-none"
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={toggleEditMode}
          autoFocus
        />
      </div>
    );
  }

  if (isDragging) {
    return (
      <div
        className="opacity-30 cursor-grab bg-mainBackgroundColor p-2.5 h-[100px] relative min-h-[100px] items-center border-2 border-rose-500 flex text-left rounded-xl"
        ref={setNodeRef}
        style={{ transition, transform: CSS.Transform.toString(transform) }}
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transition, transform: CSS.Transform.toString(transform) }}
      {...listeners}
      {...attributes}
      onMouseEnter={() => setMouseIsOver(true)}
      onMouseLeave={() => setMouseIsOver(false)}
      className="bg-mainBackgroundColor p-2.5 h-[120px] relative min-h-[100px] items-center flex text-left rounded-xl hover:ring-2 hover:ring-inset hover:ring-rose-500 task"
    >
      <div className="flex justify-between w-full">
        {/* Task title with text wrapping */}
        <p
          className="my-auto h-[90%] w-full overflow-x-auto whitespace-pre-wrap break-words"
        >
          {task.title}
        </p>
        {mouseIsOver && (
          <div className="flex gap-2">
            <button
              onClick={toggleEditMode} // Toggle edit mode on click
              className="opacity-60 hover:opacity-100 bg-transparent p-2 rounded"
            >
              <EditIcon />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="opacity-60 hover:opacity-100 stroke-white bg-commonBackgroundColor p-2 rounded"
            >
              <TrashIcon />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default TaskCard;
