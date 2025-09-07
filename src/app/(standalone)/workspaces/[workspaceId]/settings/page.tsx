import { getCurent } from "@/features/auth/action";
import { getWorkspace } from "@/features/workspaces/action";
import { EditWorkspaceForm } from "@/features/workspaces/components/edit-wrorkspace-form";
import { redirect } from "next/navigation";

interface PageProps {
  params: {
    workspaceId: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const user = getCurent();

  if (!user) {
    redirect("/sign-in");
  }

  const initialValues = await getWorkspace({ id: params.workspaceId });
  if (!initialValues) return redirect(`/workspaces/${params.workspaceId}`);

  return (
    <div className="w-full lg:max-w-xl">
      <EditWorkspaceForm initialValuse={initialValues} />
    </div>
  );
};

export default Page;
