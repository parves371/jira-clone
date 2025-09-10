"use client";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetworkspace } from "@/features/workspaces/api/use-get-workspace";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-wrorkspace-form";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

export const WorkspacesIDSettingClinet = () => {
  const workspaceId = useWorkspaceId();
  const { data: initialValues, isLoading } = useGetworkspace({ workspaceId });

  if (isLoading) return <PageLoader />;
  if (!initialValues) return <PageError message="Project not found" />;

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValuse={initialValues} />
    </div>
  );
};
