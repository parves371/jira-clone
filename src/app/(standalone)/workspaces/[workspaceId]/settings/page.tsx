import { getCurent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { WorkspacesIDSettingClinet } from "./client";

const Page = async () => {
  const user = getCurent();

  if (!user) {
    redirect("/sign-in");
  }

  return <WorkspacesIDSettingClinet />;
};

export default Page;
