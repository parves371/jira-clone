"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
interface AuthLayoutProps {
  children: React.ReactNode;
}

const AuthLayout = ({ children }: AuthLayoutProps) => {
  const patname = usePathname();
  return (
    <main className="bg-neutral-100 min-h-screen ">
      <div className="max-auto max-w-screen-2xl p-4">
        <nav className="flex justify-between items-center">
          <Image src="/logo.svg" width={152} height={56} alt="logo" />

          <Button asChild variant={"secondary"}>
            <Link href={patname === "/sign-up" ? "/sign-in" : "/sign-up"}>
              {patname === "/sign-up" ? "Sign In" : "Sign Up"}
            </Link>
          </Button>
        </nav>
        <div className="flex flex-col items-center justify-center pt-4 md:pt-14">
          {children}
        </div>
      </div>
    </main>
  );
};

export default AuthLayout;
