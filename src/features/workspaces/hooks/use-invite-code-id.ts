import { useParams } from "next/navigation";

export const useInviteCodeId = () => {
  const  params  = useParams();
  return params.inviteCode as string;
};
