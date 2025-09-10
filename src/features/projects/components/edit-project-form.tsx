"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { z } from "zod";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { useRef } from "react";

import { useForm } from "react-hook-form";
import { Project } from "../types";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/hooks/use-confirm";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDeleteProject } from "../api/use-delete-projects";
import { useUpdateProject } from "../api/use-update-projects";
import { updateProjectschema } from "../schemas";
import { ArrowLeftIcon, ImageIcon } from "lucide-react";

interface EditProjectProps {
  onCancel?: () => void;
  initialValuse: Project;
}

export const EditProjectForm = ({
  onCancel,
  initialValuse,
}: EditProjectProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { mutate, isPending } = useUpdateProject();
  const { mutate: deleteMutate, isPending: isPendingDelete } =
    useDeleteProject();

  const [DeleteDialog, confirmDeleteDialog] = useConfirm(
    "Delete Project",
    "Are you sure you want to delete this Project? This action cannot be undone.",
    "destructive"
  );

  const handleDelete = async () => {
    const ok = await confirmDeleteDialog();
    if (!ok) return;
    deleteMutate(
      { param: { projectId: initialValuse.$id } },
      {
        onSuccess: () => {
          window.location.href = `/workspaces/${initialValuse.workspaceId}`;
        },
      }
    );
  };

  const form = useForm<z.infer<typeof updateProjectschema>>({
    resolver: zodResolver(updateProjectschema),
    defaultValues: {
      ...initialValuse,
      image: initialValuse.imageUrl ?? "",
    },
  });

  const onSubmit = (values: z.infer<typeof updateProjectschema>) => {
    const finalValues = {
      ...values,
      image: values.image instanceof File ? values.image : "",
    };

    mutate({ form: finalValues, param: { projectId: initialValuse.$id } });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      form.setValue("image", file);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <DeleteDialog />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.push(
                      `/workspaces/${initialValuse.workspaceId}/projects/${initialValuse.$id}`
                    )
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
                        <FormLabel>Project name</FormLabel>
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
                            <p>Project Icon</p>
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
            <h1 className="font-bold">Danger zone</h1>
            <p className="text-sm text-muted-foreground">
              Deleting a Project is irrevsible and will removed all associated
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
              Delete project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
