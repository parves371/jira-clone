"use client";
import { useCallback } from "react";
import { useQueryState } from "nuqs";
import { Loader, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { DottedSeparator } from "@/components/dotted-separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DataFilter } from "./data-filter";
import { TaskStatus } from "../types";
import { DataKanban } from "./data-kanban";
import { useGetTasks } from "../api/use-get-tasks";
import { DataCalendar } from "./data-calendar";
import { useProjectId } from "@/features/projects/hooks/use-project-id";
import { useTaskFilters } from "../hooks/use-task-filters";
import { useBulkUpdateTasks } from "../api/use-bulk-update-task";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";

interface TaskViewSwitcherProps {
  hideProjectFilters?: boolean;
}

const TaskViewSwitcher = ({ hideProjectFilters }: TaskViewSwitcherProps) => {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const [{ search, assingneeId, dueDate, projectId, status }] =
    useTaskFilters();

  const { open } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();
  const paramProjectId = useProjectId();

  const { mutate: bulkUpdate } = useBulkUpdateTasks();

  const { data: tasks, isLoading: isLoadingTask } = useGetTasks({
    workspaceId,
    search,
    assingneeId: assingneeId,
    dueDate,
    projectId: paramProjectId || projectId,
    status,
  });

  const onkanbanChange = useCallback(
    (
      tasks: {
        $id: string;
        status: TaskStatus;
        possition: number;
      }[]
    ) => {
      bulkUpdate({
        json: {
          tasks,
        },
      });
    },
    [bulkUpdate]
  );

  return (
    <Tabs
      defaultValue={view}
      onValueChange={setView}
      className="flex-1 w-full border rounded-lg"
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row justify-between items-center">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calender">
              Calender
            </TabsTrigger>
          </TabsList>
          <Button onClick={open} size={"sm"} className="w-full lg:w-auto">
            <PlusIcon className="size-4 mr-1" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilter hideProjectFilter={hideProjectFilters} />
        <DottedSeparator className="my-4" />
        {isLoadingTask ? (
          <div className="w-full border rounded-lg h-[200px] flex flex-col items-center justify-center">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                onChange={onkanbanChange}
                data={tasks?.documents ?? []}
              />
            </TabsContent>
            <TabsContent value="calender" className="mt-0 h-full pb-4">
              <DataCalendar data={tasks?.documents ?? []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
