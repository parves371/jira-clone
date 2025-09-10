import { ProjectAnlyticsResponseType } from "@/features/projects/api/use-get-project-analytics";
import { ScrollArea, ScrollBar } from "./ui/scroll-area";
import { AnalyticsCard } from "./analitices-card";
import { DottedSeparator } from "./dotted-separator";

export const Analytics = ({ data }: ProjectAnlyticsResponseType) => {
  if (!data) {
    return null;
  }

  return (
    <ScrollArea className="border rounded-lg w-full whitespace-nowrap shrink-0">
      <div className="w-full flex flex-row">
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Total task"
            value={data.taskCount}
            variant={data.taskDifrence > 0 ? "up" : "down"}
            increaseValue={data.taskDifrence}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Assingned Tasks"
            value={data.assignedTaskCount}
            variant={data.assignedTaskDifrence > 0 ? "up" : "down"}
            increaseValue={data.assignedTaskDifrence}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Complited Tasks"
            value={data.completeTaskCount}
            variant={data.completeTaskDifrence > 0 ? "up" : "down"}
            increaseValue={data.completeTaskDifrence}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="Overdue Tasks"
            value={data.overdueTaskCount}
            variant={data.overdueTaskDifrence > 0 ? "up" : "down"}
            increaseValue={data.overdueTaskDifrence}
          />
          <DottedSeparator direction="vertical" />
        </div>
        <div className="flex items-center flex-1">
          <AnalyticsCard
            title="InComplited Tasks"
            value={data.incompleteTaskCount}
            variant={data.incompleteTaskDifrence > 0 ? "up" : "down"}
            increaseValue={data.incompleteTaskDifrence}
          />
          <DottedSeparator direction="vertical" />
        </div>
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  );
};
