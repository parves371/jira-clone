"use client";
import { PageError } from "@/components/page-error";
import { PageLoader } from "@/components/page-loader";
import { useGetworkspaceInfo } from "@/features/workspaces/api/use-get-workspace-info";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import {
    useWorkspaceId,
    useWorkspaceInviteCode,
} from "@/features/workspaces/hooks/use-workspace-id";

export const WorkspacesJoinInviteCodeClient = () => {
  const workspaceId = useWorkspaceId();
  const inviteCode = useWorkspaceInviteCode();

  const { data: initialValues, isLoading } = useGetworkspaceInfo({
    workspaceId,
  });

  if (isLoading) return <PageLoader />;
  if (!initialValues) return <PageError message="Project not found" />;

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        name={initialValues?.name}
        code={inviteCode}
        workspaceId={workspaceId}
      />
    </div>
  );
};
