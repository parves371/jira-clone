"use client";
import { DottedSeparator } from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeftIcon, CopyIcon, ImageIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useUpdateWorkspace } from "../api/use-update-workspace";
import { updateWorkspaceSchema } from "../schemas";
import { workspace } from "../types";
import { useConfirm } from "@/hooks/use-confirm";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { handle } from "hono/vercel";
import { toast } from "sonner";
import { useInviteCodeWorkspace } from "../api/use-reser-invite-code-workspace";

interface EditWorkspaceProps {
  onCancel?: () => void;
  initialValuse: workspace;
}

export const EditWorkspaceForm = ({
  onCancel,
  initialValuse,
}: EditWorkspaceProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { mutate, isPending } = useUpdateWorkspace();
  const { mutate: deleteMutate, isPending: isPendingDelete } =
    useDeleteWorkspace();

  const { mutate: inviteCodeMutate, isPending: isPendingInviteCode } =
    useInviteCodeWorkspace();

  const [DeleteDialog, confirmDeleteDialog] = useConfirm(
    "Delete Workspace",
    "Are you sure you want to delete this workspace? This action cannot be undone.",
    "destructive"
  );
  const [ResetDialog, confirmResetDialog] = useConfirm(
    "Reset Invite Code",
    "Are you sure you want to reset the invite code? This action cannot be undone.",
    "destructive"
  );

  const handleDelete = async () => {
    const ok = await confirmDeleteDialog();
    if (!ok) return;
    deleteMutate(
      { param: { workspaceId: initialValuse.$id } },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };
  const handleResetInviteCode = async () => {
    const ok = await confirmResetDialog();
    if (!ok) return;
    inviteCodeMutate(
      { param: { workspaceId: initialValuse.$id } },
      {
        onSuccess: () => {
          router.refresh();
        },
      }
    );
  };

  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValuse,
      image: initialValuse.imageUrl ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate(
      { form: finalValues, param: { workspaceId: initialValuse.$id } },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${data.$id}`);
        },
      }
    );
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValuse.$id}/join/${initialValuse.inviteCode}`;
  const handleCopyInviteLink = () => {
    navigator.clipboard.writeText(fullInviteLink).then(() => {
      toast.success("Invite link copied to clipboard");
    });
  };
  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <ResetDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValuse.$id}`)
            }
            size={"sm"}
            variant={"secondary"}
          >
            <ArrowLeftIcon className="size-4 mr-1" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValuse.name}
          </CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
          <CardContent className="p-7">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Workspace name</FormLabel>
                        <FormControl>
                          <Input placeholder="Workspace name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="image"
                    render={({ field }) => (
                      <div className="flex flex-col gap-y-4">
                        <div className="flex items-center gap-x-5">
                          {field.value ? (
                            <div className="size-[72px] relative rounded-md overflow-hidden">
                              <Image
                                src={
                                  field.value instanceof File
                                    ? URL.createObjectURL(field.value)
                                    : field.value
                                }
                                alt="workspace image"
                                fill
                                className="object-cover"
                              />
                            </div>
                          ) : (
                            <Avatar className="size-[72px]">
                              <AvatarFallback>
                                <ImageIcon className="size-36 text-neutral-400 " />
                              </AvatarFallback>
                            </Avatar>
                          )}
                          <div className="flex flex-col">
                            <p>Workspace Icon</p>
                            <p className="text-sm text-muted-foreground">
                              JPG, PNG, SVG or JPEG, maximum 1MB
                            </p>
                            <input
                              className="hidden"
                              accept=".jpeg, .png, .svg, .jpg"
                              type="file"
                              ref={inputRef}
                              disabled={isPending}
                              onChange={handleImageChange}
                            />
                            {field.value ? (
                              <Button
                                type="button"
                                variant={"teritary"}
                                disabled={isPending}
                                size={"xs"}
                                className="w-fit mt-2"
                                onClick={() => {
                                  field.onChange(null);
                                  if (inputRef.current) {
                                    inputRef.current.value = "";
                                  }
                                }}
                              >
                                Removed image
                              </Button>
                            ) : (
                              <Button
                                type="button"
                                variant={"teritary"}
                                disabled={isPending}
                                size={"xs"}
                                className="w-fit mt-2"
                                onClick={() => inputRef.current?.click()}
                              >
                                upload image
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  />
                </div>
                <DottedSeparator className="py-7" />
                <div className="flex items-center justify-between">
                  <Button
                    type="button"
                    size={"lg"}
                    variant={"secondary"}
                    onClick={onCancel}
                    disabled={isPending}
                    className={cn("", !onCancel && "invisible")}
                  >
                    Cancel
                  </Button>
                  <Button
                    disabled={isPending}
                    type="submit"
                    size={"lg"}
                    variant={"primary"}
                  >
                    update
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </div>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h1 className="font-bold">Invite members</h1>
            <p className="text-sm text-muted-foreground">
              Invite members to your workspace
            </p>
            <div className="mt-4">
              <div className="flex items-center gap-x-2">
                <input disabled value={fullInviteLink} />
                <Button
                  onClick={handleCopyInviteLink}
                  variant={"secondary"}
                  className="size-12"
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 ml-auto"
              size={"sm"}
              variant={"destructive"}
              type="button"
              disabled={isPending || isPendingDelete || isPendingInviteCode}
              onClick={handleResetInviteCode}
            >
              reset invite code
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h1 className="font-bold">Danger zone</h1>
            <p className="text-sm text-muted-foreground">
              Deleting a workspace is irrevsible and will removed all associated
              projects and tasks.
            </p>
            <DottedSeparator className="py-7" />

            <Button
              className="mt-6 ml-auto"
              size={"sm"}
              variant={"destructive"}
              type="button"
              disabled={isPending || isPendingDelete}
              onClick={handleDelete}
            >
              Delete workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
