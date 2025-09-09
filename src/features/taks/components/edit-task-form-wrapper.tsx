import { Card, CardContent } from "@/components/ui/card";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { Loader } from "lucide-react";
import { useGetTask } from "../api/use-get-task";
import { EditTaskForm } from "./edit-task-form";

interface EditTaskFormWrapperProps {
  onCancel?: () => void;
  id: string;
}

export const EditeTaskFormWrapper = ({
  onCancel,
  id,
}: EditTaskFormWrapperProps) => {
  const workspacesId = useWorkspaceId();

  const { data: initialsValue, isLoading: isLoadingTask } = useGetTask({
    taskId: id,
  });

  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId: workspacesId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId: workspacesId,
  });

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
    imageUrl: project.imageUrl,
  }));
  const membersOption = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const isloading = isLoadingProjects || isLoadingMembers || isLoadingTask;

  if (isloading) {
    return (
      <Card className="w-full h-[740px] border-none shadow-none">
        <CardContent className="flex items-center justify-center h-full">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!initialsValue) return null;

  return (
    <div>
      <EditTaskForm
        onCancel={onCancel}
        projectOption={projectOptions || []}
        membersOption={membersOption || []}
        initialValues={initialsValue}
      />
    </div>
  );
};
