import { getCurent } from "@/features/auth/queries";
import { redirect } from "next/navigation";
import { ProjectClient } from "./client";

interface PageProps {
  params: {
    projectId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const user = await getCurent();

  if (!user) {
    redirect("/sign-in");
  }

  return <ProjectClient />;
};

export default Page;
