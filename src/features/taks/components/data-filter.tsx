import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetMembers } from "@/features/members/api/use-get-members";
import { useGetProjects } from "@/features/projects/api/use-get-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { ListCheck, ListCheckIcon, UserIcon } from "lucide-react";
import { TaskStatus } from "../types";
import { useTaskFilters } from "../hooks/use-task-filters";
import { DatePicker } from "@/components/date-picker";

interface DataFilterProps {
  hideProjectFilter?: boolean;
}

export const DataFilter = ({ hideProjectFilter }: DataFilterProps) => {
  const workspaceId = useWorkspaceId();
  const { data: projects, isLoading: isLoadingProjects } = useGetProjects({
    workspaceId,
  });
  const { data: members, isLoading: isLoadingMembers } = useGetMembers({
    workspaceId,
  });
  const isLoading = isLoadingProjects || isLoadingMembers;

  const projectOptions = projects?.documents.map((project) => ({
    id: project.$id,
    name: project.name,
  }));
  const membersOption = members?.documents.map((member) => ({
    id: member.$id,
    name: member.name,
  }));

  const [{ search, assingneeId, dueDate, projectId, status }, setFilters] =
    useTaskFilters();

  const onSatusChange = (value: string) => {
    value === "all"
      ? setFilters({ status: null })
      : setFilters({ status: value as TaskStatus });
  };

  const onAssingneeChange = (value: string) => {
    value === "all"
      ? setFilters({ assingneeId: null })
      : setFilters({ assingneeId: value });
  };

  const onProjectChange = (value: string) => {
    value === "all"
      ? setFilters({ projectId: null })
      : setFilters({ projectId: value });
  };

  if (isLoading) return null;

  return (
    <div className="flex flex-col lg:flex-row gap-2">
      <Select
        onValueChange={(value) => onSatusChange(value)}
        defaultValue={status ?? undefined}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <ListCheckIcon className="size-5 mr-2" />
            <SelectValue placeholder="Filter by project" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Status</SelectItem>
          <SelectSeparator />
          <SelectItem value={TaskStatus.BLACKLOG}>Blacklog</SelectItem>
          <SelectItem value={TaskStatus.IN_PROGRESS}>IN_PROGRESS</SelectItem>
          <SelectItem value={TaskStatus.IN_REVIEW}>IN_REVIEW</SelectItem>
          <SelectItem value={TaskStatus.DONE}>DONE</SelectItem>
          <SelectItem value={TaskStatus.TODO}>TODO</SelectItem>
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) => onAssingneeChange(value)}
        defaultValue={assingneeId ?? undefined}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-5 mr-2" />
            <SelectValue placeholder="all Assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Assignees</SelectItem>
          <SelectSeparator />
          {membersOption?.map((member) => (
            <SelectItem key={member.id} value={member.id}>
              {member.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select
        onValueChange={(value) => onProjectChange(value)}
        defaultValue={projectId ?? undefined}
      >
        <SelectTrigger className="w-full lg:w-auto h-8">
          <div className="flex items-center pr-2">
            <UserIcon className="size-5 mr-2" />
            <SelectValue placeholder="all Assignees" />
          </div>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Projects</SelectItem>
          <SelectSeparator />
          {projectOptions?.map((project) => (
            <SelectItem key={project.id} value={project.id}>
              {project.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DatePicker
        placeholder="Due date"
        className="h-8 w-full lg:w-auto"
        value={dueDate ? new Date(dueDate) : undefined}
        onChange={(date) =>
          setFilters({ dueDate: date ? date.toISOString() : null })
        }
      />
    </div>
  );
};
