import Link from "next/link";
import { Task } from "../types";
import { Project } from "@/features/projects/types";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ChevronRightIcon, TrashIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteTask } from "../api/use-delete-task";
import { useRouter } from "next/navigation";

interface TaskBredcrumsProps {
  project: Project;
  task: Task;
}

export const TaskBredcrums = ({ project, task }: TaskBredcrumsProps) => {
  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useDeleteTask();
  const [ConfirmDialog, confirm] = useConfirm(
    "Delete Member",
    "Are you sure you want to delete this member? This action cannot be undone.",
    "destructive"
  );

  const router = useRouter();

  const handleDeleteTask = async () => {
    const ok = await confirm();
    if (!ok) return;
    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => router.push(`/workspaces/${workspaceId}/tasks`),
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmDialog />
      <ProjectAvatar
        className="size-6 lg:size-8"
        name={project.name}
        image={project.imageUrl}
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>

      <ChevronRightIcon className="size-4 lg:size-5 text-muted-foreground" />

      <p className="text-sm lg:text-lg font-medium">{task.name}</p>

      <Button
        onClick={handleDeleteTask}
        disabled={isPending}
        className="ml-auto"
        variant={"destructive"}
        size={"sm"}
      >
        <TrashIcon className="size-4 lg:mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};
