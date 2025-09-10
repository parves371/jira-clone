import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface Project {
  workspaceId: string;
}

export const useGetworkspaceInfo = ({ workspaceId }: Project) => {
  const query = useQuery({
    queryKey: ["workspace-info", workspaceId],

    queryFn: async () => {
      const res = await client.api.workspaces[":workspaceId"]["info"].$get({
        param: { workspaceId },
      });

      if (!res.ok) {
        throw new Error("Failed to get workspaceInfo");
      }

      const { data } = await res.json();
      return data;
    },
  });

  return query;
};
