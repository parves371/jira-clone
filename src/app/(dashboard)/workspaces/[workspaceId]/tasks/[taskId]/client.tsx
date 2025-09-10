"use client";

import { useTaskId } from "@/features/taks/hooks/use-task-id";
import { useGetTask } from "@/features/taks/api/use-get-task";

import { PageLoader } from "@/components/page-loader";
import { PageError } from "@/components/page-error";
import { DottedSeparator } from "@/components/dotted-separator";

import { TaskBredcrums } from "@/features/taks/components/task-bredcrums";
import { TaskOverView } from "@/features/taks/components/task-overview";
import { TaskDescription } from "@/features/taks/components/task-description";
export const TaskIdClient = () => {
  const TaskId = useTaskId();

  const { data, isLoading } = useGetTask({ taskId: TaskId });

  if (isLoading) {
    return <PageLoader />;
  }
  if (!data) {
    return <PageError message="Task not found" />;
  }

  return (
    <div className="flex flex-col ">
      <TaskBredcrums project={data.project} task={data} />
      <DottedSeparator />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <TaskOverView task={data} />
        <TaskDescription task={data} />
      </div>
    </div>
  );
};
