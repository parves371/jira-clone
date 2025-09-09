import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ExternalLinkIcon, PencilIcon, TrashIcon } from "lucide-react";

interface TaskActionProps {
  id: string;
  projectId: string;
  children: React.ReactNode;
}

export const TaskAction = ({ id, projectId, children }: TaskActionProps) => {
  return (
    <div className="flex justify-end">
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
        <DropdownMenuContent className="w-48" align="end">
          <DropdownMenuItem
            className="font-medium p-[10px]"
            onClick={() => {}}
            disabled={false}
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Task Details
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-medium p-[10px]"
            onClick={() => {}}
            disabled={false}
          >
            <ExternalLinkIcon className="size-4 mr-2 stroke-2" />
            Opne project
          </DropdownMenuItem>
          <DropdownMenuItem
            className="font-medium p-[10px]"
            onClick={() => {}}
            disabled={false}
          >
            <PencilIcon className="size-4 mr-2 stroke-2" />
            Edit Task
          </DropdownMenuItem>

          <DropdownMenuItem
            className=" text-amber-500 focus:text-amber-700 font-medium p-[10px] "
            onClick={() => {}}
            disabled={false}
          >
            <TrashIcon className="size-4 mr-2 stroke-2" />
            Delete Task
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
