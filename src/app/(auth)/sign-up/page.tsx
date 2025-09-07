import { getCurent } from "@/features/auth/action";
import { SignUpCard } from "@/features/auth/components/sign-up";
import { redirect } from "next/navigation";

const SignUpPage = async () => {
  const user = await getCurent();
  if (user) {
    redirect("/");
  }
  return <SignUpCard />;
};

export default SignUpPage;
