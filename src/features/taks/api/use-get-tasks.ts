import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { TaskStatus } from "../types";

interface Project {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  assingneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
}

export const useGetTasks = ({
  workspaceId,
  assingneeId,
  dueDate,
  projectId,
  status,
  search,
}: Project) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      assingneeId,
      status,
      dueDate,
      search,
    ],

    queryFn: async () => {
      const res = await client.api.tasks.$get({
        query: {
          workspaceId,
          projectId: projectId ?? undefined,
          status: status ?? undefined,
          dueDate: dueDate ?? undefined,
          search: search ?? undefined,
          assigneeId: assingneeId ?? undefined,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to get tasks  ");
      }

      const { data } = await res.json();
      return data;
    },
  });

  return query;
};
