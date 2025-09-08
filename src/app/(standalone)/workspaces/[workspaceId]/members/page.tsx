import { getCurent } from "@/features/auth/queries";
import { MembersList } from "@/features/workspaces/components/members-list";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await getCurent();

  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div className="w-full lg:max-w-lg">
      <MembersList />
    </div>
  );
};

export default Page;
