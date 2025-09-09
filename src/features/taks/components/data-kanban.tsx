import { useState } from "react";
import { Task, TaskStatus } from "../types";

interface DataKanbanProps {
  data: Task[];
}

const boards: TaskStatus[] = [
  TaskStatus.BLACKLOG,
  TaskStatus.TODO,
  TaskStatus.IN_PROGRESS,
  TaskStatus.IN_REVIEW,
  TaskStatus.DONE,
];

type TasksState = {
  [key in TaskStatus]: Task[];
};

import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { KanbanColumnHeader } from "./kanban-column-header";

export const DataKanban = ({ data }: DataKanbanProps) => {
  const [tasks, setTasks] = useState<TasksState>(() => {
    const initialsTask: TasksState = {
      [TaskStatus.BLACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      initialsTask[task.status].push(task);
    });

    Object.keys(initialsTask).forEach((status) => {
      initialsTask[status as TaskStatus].sort((a, b) => a.postion - b.position);
    });

    return initialsTask;
  });

  return (
    <DragDropContext onDragEnd={() => {}}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
