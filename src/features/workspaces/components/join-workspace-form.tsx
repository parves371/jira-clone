"use client";
import { DottedSeparator } from "@/components/dotted-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { redirect, useRouter } from "next/navigation";
import { usejoinWorkspace } from "../api/use-join-workspace";

export const JoinWorkspaceForm = ({
  name,
  workspaceId,
  code,
}: {
  name: string;
  workspaceId: string;
  code: string;
}) => {
  if (!name) return redirect("/");
  const { mutate, isPending } = usejoinWorkspace();

  const router = useRouter();

  const onSubmit = () => {
    mutate(
      { param: { workspaceId: workspaceId }, json: { code } },
      {
        onSuccess: ({ data }) => {
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader>
        <CardTitle>Join Workspace</CardTitle>
        <CardDescription>
          You&apos;ve been invited to join <strong>{name}</strong>
        </CardDescription>
      </CardHeader>
      <div className="py-7">
        <DottedSeparator />
      </div>
      <div className="flex flex-col lg:flex-row gap-2 p-2 items-center justify-between">
        <Button
          variant={"secondary"}
          type="button"
          asChild
          className="w-full lg:w-fit"
          size={"lg"}
        >
          <Link href={"/"}>Cancel</Link>
        </Button>
        <Button
          onClick={onSubmit}
          disabled={!code || isPending}
          size={"lg"}
          type="button"
          className="w-full lg:w-fit"
        >
          Join
        </Button>
      </div>
    </Card>
  );
};
