import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import React from "react";
import Link from "next/link";

export const SignUpCard = () => {
  return (
    <Card className="w-full h-full md:w-[487px] border-none shadow-none">
      <CardHeader className="flex justyfy-center items-center text-center p-7">
        <CardTitle className="text-2xl">Sign Up</CardTitle>
        <CardDescription>
          By signing up, you agree to our{" "}
          <Link href={"/Service"}>
            <span className="text-blue-700">Terms of Service</span>
          </Link>
          and{" "}
          <Link href={"/privacy"}>
            <span className="text-blue-700">Privacy Policy.</span>
          </Link>
        </CardDescription>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <form className="space-y-4">
          <Input
            required
            type="text"
            placeholder="Enter Name"
            value={""}
            onChange={() => {}}
            disabled={false}
          />
          <Input
            required
            type="email"
            placeholder="Enter Email"
            value={""}
            onChange={() => {}}
            disabled={false}
          />
          <Input
            required
            type="password"
            placeholder="Enter your Password"
            value={""}
            onChange={() => {}}
            disabled={false}
            min={8}
            max={256}
          />
          <Button disabled={false} size={"lg"} className="w-full">
            Sign up
          </Button>
        </form>
      </CardContent>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7 flex flex-col gap-y-6">
        <Button
          variant={"secondary"}
          size={"lg"}
          className="w-full"
          disabled={false}
        >
          <FcGoogle className="mr-2 size-5" />
          <span>Sign In with Google</span>
        </Button>
        <Button
          variant={"secondary"}
          size={"lg"}
          className="w-full"
          disabled={false}
        >
          <FaGithub className="mr-2 size-5" />
          <span>Sign In with Github</span>
        </Button>
      </CardContent>
    </Card>
  );
};
