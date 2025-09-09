import { useCallback, useEffect, useState } from "react";
import { Task, TaskStatus } from "../types";

interface DataKanbanProps {
  data: Task[];
  onChange: (
    task: {
      $id: string;
      status: TaskStatus;
      possition: number;
    }[]
  ) => void;
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
  type DropResult,
} from "@hello-pangea/dnd";
import { KanbanColumnHeader } from "./kanban-column-header";
import { KanbanCard } from "./kanban-card";

export const DataKanban = ({ data, onChange }: DataKanbanProps) => {
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

  useEffect(() => {
    const newTask: TasksState = {
      [TaskStatus.BLACKLOG]: [],
      [TaskStatus.TODO]: [],
      [TaskStatus.IN_PROGRESS]: [],
      [TaskStatus.IN_REVIEW]: [],
      [TaskStatus.DONE]: [],
    };

    data.forEach((task) => {
      newTask[task.status].push(task);
    });

    Object.keys(newTask).forEach((status) => {
      newTask[status as TaskStatus].sort((a, b) => a.postion - b.position);
    });
    setTasks(newTask);
  }, [data]);

  const onDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;

      const { source, destination } = result;

      const sourceStaus = source.droppableId as TaskStatus;
      const destinationStatus = destination.droppableId as TaskStatus;

      let updatePayLoad: {
        $id: string;
        status: TaskStatus;
        possition: number;
      }[] = [];

      setTasks((prev) => {
        const newTasks = { ...prev };

        // Safely remove the Task from the source column
        const sourceColumn = [...newTasks[sourceStaus]];
        const [movedTask] = sourceColumn.splice(source.index, 1);
        // If the Task is dropped in the same column, do nothing
        if (!movedTask) {
          console.error("No task found as source index");
          return prev;
        }

        // created a new  task object with potentials updated state
        const updatedMovedTask =
          sourceStaus !== destinationStatus
            ? {
                ...movedTask,
                status: destinationStatus,
              }
            : movedTask;

        newTasks[sourceStaus] = sourceColumn;
        // add the task to the destination column
        const destColumn = [...newTasks[destinationStatus]];
        destColumn.splice(destination.index, 0, updatedMovedTask);
        newTasks[destinationStatus] = destColumn;

        // Prepare minimal update payload
        updatePayLoad = [];

        // Always update the moved task
        updatePayLoad.push({
          $id: updatedMovedTask.$id,
          status: updatedMovedTask.status,
          possition: Math.min((destination.index + 1) * 1000, 1_000_000),
        });

        // Updated possition for affeected task in the destination column
        newTasks[destinationStatus].forEach((task, index) => {
          if (task && task.$id !== updatedMovedTask.$id) {
            const newPosition = Math.min((index + 1) * 1000, 1_000_000);
            if (task.possition !== newPosition) {
              updatePayLoad.push({
                $id: task.$id,
                status: task.status,
                possition: newPosition,
              });
            }
          }
        });

        // if the task  moved between column, updated possition in the source column
        if (sourceStaus !== destinationStatus) {
          newTasks[sourceStaus].forEach((task, index) => {
            if (task) {
              const newPostion = Math.min((index + 1) * 1000, 1_000_000);
              if (task.possition !== newPostion) {
                updatePayLoad.push({
                  $id: task.$id,
                  status: task.status,
                  possition: newPostion,
                });
              }
            }
          });
        }

        return newTasks;
      });

      onChange(updatePayLoad);
    },
    [onChange]
  );

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex overflow-x-auto">
        {boards.map((board) => {
          return (
            <div
              key={board}
              className="flex-1 mx-2 bg-muted p-1.5 rounded-md min-w-[200px]"
            >
              <KanbanColumnHeader
                board={board}
                taskCount={tasks[board].length}
              />

              <Droppable droppableId={board}>
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="min-h-[200px] py-1.5"
                  >
                    {tasks[board].map((task, index) => (
                      <Draggable
                        key={task.$id}
                        draggableId={task.$id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className=""
                          >
                            <KanbanCard task={task} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </div>
          );
        })}
      </div>
    </DragDropContext>
  );
};
