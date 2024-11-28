import { SortableContext, useSortable } from "@dnd-kit/sortable";
import TrashIcon from "../icons/TrashIcon";
import PlusIcon from "../icons/PlusIcon";
import { CSS } from "@dnd-kit/utilities";
import { useMemo, useState } from "react";
import { Column, Id, Tasks } from "../types";
import TaskCard from "./TaskCard";

interface ColumnContainerProps {
  column: Column;
  deleteColumn: (id: Id) => void;
  updateColumn: (id: Id, title: string) => void;
  createTask: (columnId: Id) => void;
  tasks: Tasks[];
  deleteTask: (id: Id) => void;
  updateTask: (id: Id, content: string) => void;
}

function ColumnContainer(props: ColumnContainerProps) {
  const { 
    column, 
    deleteColumn, 
    updateColumn, 
    createTask, 
    tasks, 
    deleteTask, 
    updateTask 
  } = props;

  const [editMode, setEditMode] = useState(false);

  const columnTasks = useMemo(() => 
    tasks.filter(task => task.columnId === column.id), 
    [tasks, column.id]
  );

  const taskIds = useMemo(() => 
    columnTasks.map(task => task.id), 
    [columnTasks]
  );

  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: column.id,
    data: {
      type: "Column",
      column,
    },
    disabled: editMode,
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="bg-commonBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col opacity-60 border-2 border-rose-500 shrink-0"
      ></div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-commonBackgroundColor w-[350px] h-[500px] max-h-[500px] rounded-md flex flex-col shrink-0"
    >
      <div
        {...attributes}
        {...listeners}
        onClick={() => setEditMode(true)}
        className="bg-mainBackgroundColor text-md min-h-[60px] cursor-grab rounded-md rounded-b-none border-4 border-commonBackgroundColor flex justify-between"
      >
        <div className="flex gap-2 items-center h-full p-2">
          <div className="flex justify-center items-center bg-commonBackgroundColor px-1 py-1 text-sm rounded-full">
            {columnTasks.length}
          </div>
          {!editMode && column.title}
          {editMode && (
            <input
              type="text"
              className="
                bg-black 
                border 
                border-rose-500 
                focus:outline-none 
                focus:ring-2 
                focus:ring-rose-500 
                rounded 
                px-2 
                text-white
              "
              autoFocus
              value={column.title || ""}
              onChange={(e) => updateColumn(column.id, e.target.value)}
              onBlur={() => setEditMode(false)}
              onKeyDown={(e) => e.key === "Enter" && setEditMode(false)}
            />
          )}
        </div>
        <button
          className="stroke-gray-500 hover:stroke-white mr-1"
          onClick={() => deleteColumn(column.id)}
        >
          <TrashIcon />
        </button>
      </div>

      <div className="flex flex-grow gap-4 p-2 overflow-x-hidden overflow-y-auto">
        <div className="w-full flex gap-2 flex-col">
          <SortableContext items={taskIds}>
            {columnTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            ))}
          </SortableContext>
        </div>
      </div>

      <button
        className="flex gap-2 items-center border-commonBackgroundColor border-2 rounded-md p-4 hover:bg-mainBackgroundColor hover:text-rose-500 active:bg-black"
        onClick={() => createTask(column.id)}
      >
        <PlusIcon /> Add Task
      </button>
    </div>
  );
}

export default ColumnContainer;