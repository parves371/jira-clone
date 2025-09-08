import { redirect } from "next/navigation";
import { getCurent } from "@/features/auth/queries";
import { CreateWorkspaceForm } from "@/features/workspaces/components/create-wrorkspace-form";

const Page = async () => {
  const user = await getCurent();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full lg:max-w-xl">
      <CreateWorkspaceForm />
    </div>
  );
};

export default Page;
