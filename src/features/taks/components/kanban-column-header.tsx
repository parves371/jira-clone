import { snakeCaseToTitleCase } from "@/lib/utils";
import {
  CircleCheckIcon,
  CircleDashedIcon,
  CircleDotDashedIcon,
  CircleDotIcon,
  CircleIcon,
  PlusIcon,
} from "lucide-react";
import React from "react";
import { TaskStatus } from "../types";
import { Button } from "@/components/ui/button";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

interface KanbanBoardProps {
  board: TaskStatus;
  taskCount: number;
}

const statusIconMap: Record<TaskStatus, React.ReactNode> = {
  [TaskStatus.BLACKLOG]: (
    <CircleDashedIcon className="size-[18px] text-pink-400" />
  ),
  [TaskStatus.TODO]: <CircleIcon className="size-[18px] text-red-400" />,
  [TaskStatus.IN_PROGRESS]: (
    <CircleDotDashedIcon className="size-[18px] text-yellow-400" />
  ),
  [TaskStatus.IN_REVIEW]: (
    <CircleDotIcon className="size-[18px] text-blue-400" />
  ),
  [TaskStatus.DONE]: (
    <CircleCheckIcon className="size-[18px] text-emerald-400" />
  ),
};

export const KanbanColumnHeader = ({ board, taskCount }: KanbanBoardProps) => {
  const Icon = statusIconMap[board];

  const { open } = useCreateTaskModal();

  return (
    <div className="w-full px-2 py-1.5 flex items-center justify-between">

      <div className="flex items-center gap-x-2">
        {Icon}
        <h2 className="text-sm font-medium">{snakeCaseToTitleCase(board)}</h2>
        <div className="size-5 flex items-center justify-center rounded-md bg-neutral-200 text-xs text-neutral-700 font-medium">
          {taskCount}
        </div>
      </div>
      
      <Button onClick={open} variant={"ghost"} className="size-5" size={"icon"}>
        <PlusIcon className="size-4 text-neutral-500" />
      </Button>
    </div>
  );
};
