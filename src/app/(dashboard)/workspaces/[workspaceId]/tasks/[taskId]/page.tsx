import { getCurent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { TaskIdClient } from "./client";

const Page = async () => {
  const user = await getCurent();
  if (!user) {
    redirect("/sign-in");
  }

  return <TaskIdClient />;
};

export default Page;
