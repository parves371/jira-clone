import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface Project {
  projectId: string;
}

export const useGetProject = ({ projectId }: Project) => {
  const query = useQuery({
    queryKey: ["project", projectId],

    queryFn: async () => {
      const res = await client.api.projects[":projectId"].$get({
        param: { projectId },
      });

      if (!res.ok) {
        throw new Error("Failed to get project");
      }

      const { data } = await res.json();
      return data;
    },
  });

  return query;
};
