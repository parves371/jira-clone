import { useParams } from "next/navigation";

export const useWorkspaceId = () => {
  const  params  = useParams();
  return params.workspaceId as string;
};
export const useWorkspaceInviteCode = () => {
  const  params  = useParams();
  return params.inviteCode as string;
};
