import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

interface AnalyticsProps {
  workspaceId: string;
}

export type ProjectWorkspaceResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["analytics"]["$get"],
  200
>;

export const useGetWorkspacesAnalytics = ({ workspaceId }: AnalyticsProps) => {
  const query = useQuery({
    queryKey: ["workspace-analytics", workspaceId],

    queryFn: async () => {
      const res = await client.api.workspaces[":workspaceId"]["analytics"].$get(
        {
          param: { workspaceId },
        }
      );

      if (!res.ok) {
        throw new Error("Failed to get workspace analytics");
      }

      const { data } = await res.json();
      return data;
    },
  });

  return query;
};
