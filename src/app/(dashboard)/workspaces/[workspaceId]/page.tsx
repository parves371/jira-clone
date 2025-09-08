import { getCurent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

const Page = async () => {
  const user = await getCurent();
  if (!user) {
    redirect("/sign-in");
  }

  return <div>Page</div>;
};

export default Page;
