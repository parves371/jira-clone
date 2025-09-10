import { PencilIcon } from "lucide-react";
import { Task } from "../types";

import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { MemberAvatar } from "@/features/members/components/members-avatar";

import { Badge } from "@/components/ui/badge";
import { snakeCaseToTitleCase } from "@/lib/utils";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";
import { TaskDate } from "./task-date";
import { TaskOverViewProperty } from "./task-overview-property";

interface Props {
  task: Task;
}

export const TaskOverView = ({ task }: Props) => {
  const { open } = useEditTaskModal();

  return (
    <div className="flex flex-col gap-y-4 columns-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium">OverView</p>
          <Button
            onClick={() => open(task.$id)}
            size={"sm"}
            variant={"secondary"}
          >
            <PencilIcon className="size-2 mr-2" />
            Edit
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <div className="flex flex-col gap-y-4">
          <TaskOverViewProperty label="Assingee">
            <MemberAvatar name={task.assignee.name} className="size-6" />
            <p className="text-sm font-medium">{task.assignee.name}</p>
          </TaskOverViewProperty>
          <TaskOverViewProperty label="Due Date">
            <TaskDate value={task.dueDate} className="text-sm font-medium" />
          </TaskOverViewProperty>
          <TaskOverViewProperty label="Status">
            <Badge variant={task.status}>
              {snakeCaseToTitleCase(task.status)}
            </Badge>
          </TaskOverViewProperty>
        </div>
      </div>
    </div>
  );
};
