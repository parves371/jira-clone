import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { InferResponseType } from "hono";

interface AnalyticsProps {
  projectId: string;
}

export type ProjectAnlyticsResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["analytics"]["$get"],
  200
>;

export const useGetProjectAnalytics = ({ projectId }: AnalyticsProps) => {
  const query = useQuery({
    queryKey: ["project-analytics", projectId],

    queryFn: async () => {
      const res = await client.api.projects[":projectId"]["analytics"].$get({
        param: { projectId },
      });

      if (!res.ok) {
        throw new Error("Failed to get project analytics");
      }

      const { data } = await res.json();
      return data;
    },
  });

  return query;
};
