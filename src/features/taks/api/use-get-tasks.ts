import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface Project {
  workspaceId: string;
}

export const useGetTasks = ({ workspaceId }: Project) => {
  const query = useQuery({
    queryKey: ["projects", workspaceId],

    queryFn: async () => {
      const res = await client.api.tasks.$get({ query: { workspaceId } });

      if (!res.ok) {
        throw new Error("Failed to get tasks  ");
      }

      const { data } = await res.json();
      return data;
    },
  });

  return query;
};
