import { useQuery } from "@tanstack/react-query";
import { client } from "@/lib/rpc";
import { TaskStatus } from "../types";

interface Task {
  taskId: string;
}

export const useGetTask = ({ taskId }: Task) => {
  const query = useQuery({
    queryKey: ["task", taskId],

    queryFn: async () => {
      const res = await client.api.tasks[":taskId"].$get({ param: { taskId } });

      if (!res.ok) {
        throw new Error("Failed to get task  ");
      }

      const { data } = await res.json();
      return data;
    },
  });

  return query;
};
