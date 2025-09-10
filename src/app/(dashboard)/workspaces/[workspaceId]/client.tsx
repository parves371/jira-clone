"use client";
import { formatDistanceToNow } from "date-fns";
import { CalendarIcon, PlusIcon, SettingsIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { PageError } from "@/components/page-error";
import { Analytics } from "@/components/analytics";
import { PageLoader } from "@/components/page-loader";
import { DottedSeparator } from "@/components/dotted-separator";
import { Card, CardContent } from "@/components/ui/card";

import { Task } from "@/features/taks/types";
import { Member } from "@/features/members/types";
import { Project } from "@/features/projects/types";
import { useGetTasks } from "@/features/taks/api/use-get-tasks";
import { MemberAvatar } from "@/features/members/components/members-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useCreateTaskModal } from "@/features/taks/hooks/use-create-task-modal";
import { useCreateProjectModal } from "@/features/projects/hooks/use-create-project-modal";
import { useGetWorkspacesAnalytics } from "@/features/workspaces/api/use-get-workspace-analytics";

export const WorkspaceIdClient = () => {
  const workspaceId = useWorkspaceId();
  const { data: analytics, isLoading: isLoadingAnalytics } =
    useGetWorkspacesAnalytics({ workspaceId });
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
  });
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });

  const isLaoding =
    isLoadingAnalytics ||
    isLoadingTasks ||
    isLoadingProjects ||
    isLoadingMembers;

  if (isLaoding) {
    return <PageLoader />;
  }
  if (!analytics || !tasks || !projects || !members) {
    return <PageError message="Faild to load workspace data" />;
  }

  return (
    <div className="h-full">
      <Analytics data={analytics} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <TaskList data={tasks.documents} total={tasks.total} />
        <ProjectList data={projects.documents} total={projects.total} />
        <MemberList data={members.documents} total={members.total} />
      </div>
    </div>
  );
};

export const TaskList = ({ data, total }: { data: Task[]; total: number }) => {
  const { open: createTask } = useCreateTaskModal();
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-muted rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Tasks ({total})</p>
          <Button variant={"muted"} size={"icon"} onClick={createTask}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="flex flex-col gap-y-4">
          {data.map((task) => (
            <li key={task.$id}>
              <Link href={`/workspaces/${workspaceId}/tasks/${task.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4">
                    <p className="text-lg font-medium truncate">{task.name}</p>
                    <div className="flex items-center gap-x-2">
                      <p className="">{task.project?.name}</p>

                      <div className="size-1 rounded-full bg-neutral-300" />

                      <div className="text-sm text-muted-foreground flex items-center">
                        <CalendarIcon className="size-4 mr-1" />
                        <span className="truncate">
                          {formatDistanceToNow(new Date(task.dueDate))}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}

          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No task found
          </li>
        </ul>
        <Button className="mt-4 w-full" variant={"muted"} asChild>
          <Link href={`/workspaces/${workspaceId}/tasks`}>Show all</Link>
        </Button>
      </div>
    </div>
  );
};
export const ProjectList = ({
  data,
  total,
}: {
  data: Project[];
  total: number;
}) => {
  const { open: createProject } = useCreateProjectModal();

  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Project ({total})</p>
          <Button variant={"secondary"} size={"icon"} onClick={createProject}>
            <PlusIcon className="size-4 text-neutral-400" />
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map((project) => (
            <li key={project.$id}>
              <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
                <Card className="shadow-none rounded-lg hover:opacity-75 transition">
                  <CardContent className="p-4 flex items-center gap-x-2.5">
                    <ProjectAvatar
                      name={project.name}
                      image={project.imageUrl}
                      className="size-12"
                      fallbackClassName="text-lg"
                    />
                    <p className="text-lg font-medium truncate">
                      {project.name}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            </li>
          ))}

          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No project found
          </li>
        </ul>
      </div>
    </div>
  );
};
export const MemberList = ({
  data,
  total,
}: {
  data: Member[];
  total: number;
}) => {
  const workspaceId = useWorkspaceId();

  return (
    <div className="flex flex-col gap-y-4 col-span-1">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold">Membes ({total})</p>
          <Button variant={"secondary"} size={"icon"} asChild>
            <Link href={`/workspaces/${workspaceId}/members`}>
              <SettingsIcon className="size-4 text-neutral-400" />
            </Link>
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((member) => (
            <li key={member.$id}>
              <Card className="shadow-none rounded-lg overflow-hidden">
                <CardContent className="p-4 flex flex-col items-center gap-x-2.5">
                  <MemberAvatar
                    name={member.name}
                    className="size-12"
                    fallbackClassName="text-lg"
                  />
                  <div className="flex flex-col items-center overflow-hidden w-full">
                    <p className="text-lg font-medium truncate w-full text-center">
                      {member.name}
                    </p>
                    <p className="text-sm text-muted-foreground truncate w-full text-center">
                      {member.email}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </li>
          ))}

          <li className="text-sm text-muted-foreground text-center hidden first-of-type:block">
            No member found
          </li>
        </ul>
      </div>
    </div>
  );
};
