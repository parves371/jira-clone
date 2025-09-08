import { getCurent } from "@/features/auth/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const user = await getCurent();

  if (!user) {
    redirect("/sign-in");
  }
  const workspace = await getWorkspaceInfo({ id: params.workspaceId });
  if (!workspace?.name) return redirect(`/`);
  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm
        name={workspace?.name}
        code={params.inviteCode}
        workspaceId={params.workspaceId}
      />
    </div>
  );
};

export default Page;
