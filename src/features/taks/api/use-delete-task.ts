import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$delete"],
  200
>;
type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$delete"]
>;

export const useDeleteTask = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      const res = await client.api.tasks[":taskId"].$delete({
        param,
      });
      if (!res.ok) {
        throw new Error("Failed to delete task");
      }
      return await res.json();
    },
    onSuccess: ({ data }) => {
      toast.success("task deleted successfully");
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["tasks", data.$id] });
    },
    onError: () => toast.error("Failed to delete task"),
  });

  return mutation;
};
