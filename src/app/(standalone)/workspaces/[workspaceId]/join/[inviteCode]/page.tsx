import { getCurent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkspacesJoinInviteCodeClient } from "./clinet";

const Page = async () => {
  const user = await getCurent();

  if (!user) {
    redirect("/sign-in");
  }

  return <WorkspacesJoinInviteCodeClient />;
};

export default Page;
