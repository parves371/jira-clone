"use client";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader, PlusIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { useGetTasks } from "../api/use-get-tasks";
import { useCreateTaskModal } from "../hooks/use-create-task-modal";
import { useTaskFilters } from "../hooks/use-task-filters";
import { columns } from "./columns";
import { DataFilter } from "./data-filter";
import { DataTable } from "./data-table";
import { DataKanban } from "./data-kanban";

const TaskViewSwitcher = () => {
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });

  const [{ search, assingneeId, dueDate, projectId, status }] =
    useTaskFilters();

  const { open } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();

  const { data: tasks, isLoading: isLoadingTask } = useGetTasks({
    workspaceId,
    search,
    assingneeId: assingneeId,
    dueDate,
    projectId,
    status,
  });

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
        <DataFilter />
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
              <DataKanban data={tasks?.documents ?? []} />
            </TabsContent>
            <TabsContent value="calender" className="mt-0">
              {JSON.stringify(tasks, null, 2)}
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};

export default TaskViewSwitcher;
