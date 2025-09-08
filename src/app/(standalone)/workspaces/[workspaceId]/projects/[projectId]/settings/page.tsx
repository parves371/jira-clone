import { getCurent } from "@/features/auth/queries";
import { EditProjectForm } from "@/features/projects/components/edit-wrorkspace-form";
import { getProject } from "@/features/projects/queries";
import { redirect } from "next/navigation";

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

  const initialValues = await getProject({ id: params.projectId });
  if (!initialValues) return redirect(`/`);

  return (
    <div className="w-full lg:max-w-xl">
      <EditProjectForm initialValuse={initialValues} />
    </div>
  );
};

export default Page;
