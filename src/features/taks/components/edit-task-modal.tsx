"use client";

import { ResposiveModal } from "@/components/responsive-modal";
import { useEditTaskModal } from "../hooks/use-edit-task-modal";
import { CreateTaskFormWrapper } from "./create-task-form-wrapper";
import { EditeTaskFormWrapper } from "./edit-task-form-wrapper";

export const EditeTaskModal = () => {
  const { taskID, close } = useEditTaskModal();

  return (
    <ResposiveModal open={!!taskID} onOpenChange={close}>
      {taskID && <EditeTaskFormWrapper id={taskID} onCancel={close} />}
    </ResposiveModal>
  );
};
