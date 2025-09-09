import { useQueryState, parseAsBoolean, parseAsString } from "nuqs";

export const useEditTaskModal = () => {
  const [taskID, setTaskId] = useQueryState("edite-task", parseAsString);

  const open = (id: string) => setTaskId(id);
  const close = () => setTaskId(null);

  return {
    taskID,
    open,
    close,
    setTaskId,
  };
};
