"use client";
import { ResposiveModal } from "@/components/responsive-modal";
import { CreateWorkspaceForm } from "./create-wrorkspace-form";
import { useCreateWorkspaceModal } from "../hooks/use-create-workspace-modal";

export const CreateWorkspaceModal = () => {
  const { isOpen, setIsOpen ,close } = useCreateWorkspaceModal();
  return (
    <ResposiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close} />
    </ResposiveModal>
  );
};
