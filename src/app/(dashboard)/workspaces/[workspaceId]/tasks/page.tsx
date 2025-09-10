import { getCurent } from "@/features/auth/queries";
import TaskViewSwitcher from "@/features/taks/components/task-view-switcher";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await getCurent();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="h-full flex flex-col">
      <TaskViewSwitcher />;
    </div>
  );
};

export default Page;
