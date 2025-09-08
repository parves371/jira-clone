"use client";
import { Button } from "@/components/ui/button";
import { AlertTriangleIcon } from "lucide-react";

import Link from "next/link";

const Error = () => {
  return (
    <div className="h-screen flex items-center justify-center  flex-col gap-y-2">
      <AlertTriangleIcon className="size-5 textmu" />
      <p className="text-sm ">Something went wrong</p>
      <Button asChild variant={"secondary"} size={"sm"}>
        <Link href={"/"}>back to home</Link>
      </Button>
    </div>
  );
};

export default Error;
