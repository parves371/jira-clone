import { getCurent } from "@/features/auth/action";
import { UserButton } from "@/features/auth/components/user-button";
import { redirect } from "next/navigation";

export default async function Home() {
  const user = await getCurent();
  if (!user) {
    redirect("/sign-in");
  }

  return (
    <div>
      <UserButton />
    </div>
  );
}
