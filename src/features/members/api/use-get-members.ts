import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";

interface Member {
  workspaceId: string;
}

export const useGetMembers = ({ workspaceId }: Member) => {
  const query = useQuery({
    queryKey: ["members", workspaceId],
    queryFn: async () => {
      const res = await client.api.members.$get({
        query: {
          workspaceId,
        },
      });

      if (!res.ok) {
        throw new Error("Failed to get Members");
      }

      const { data } = await res.json();
      return data;
    },
  });

  return query;
};
