import { getCurent } from "@/features/auth/action";
import { UserButton } from "@/features/auth/components/user-button";
import { CreateWorkspace } from "@/features/workspaces/components/create-wrorkspace-form";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurent();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="bg-neutral-500 p-4 h-full">
      <CreateWorkspace />
    </div>
  );
}
