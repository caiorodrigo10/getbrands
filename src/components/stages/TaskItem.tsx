import { Trash2 } from "lucide-react";
import { useState } from "react";
import { TaskStatusSelect } from "./TaskStatusSelect";
import { TaskAssigneeSelect } from "./TaskAssigneeSelect";
import { TaskDatePicker } from "./TaskDatePicker";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { type TaskStatus, type AssigneeType } from "../StagesTimeline";

interface TaskItemProps {
  name: string;
  status: TaskStatus;
  date?: string;
  startDate?: Date;
  endDate?: Date;
  assignee?: AssigneeType;
  onUpdate: (newName: string) => void;
  onDelete: () => void;
}

export const TaskItem = ({ 
  name, 
  status, 
  startDate, 
  endDate, 
  assignee = "none",
  onUpdate,
  onDelete
}: TaskItemProps) => {
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(status);
  const [taskAssignee, setTaskAssignee] = useState<AssigneeType>(assignee);
  const [taskStartDate, setTaskStartDate] = useState<Date | undefined>(startDate);
  const [taskEndDate, setTaskEndDate] = useState<Date | undefined>(endDate);

  const isTextTruncated = (text: string) => {
    const tempDiv = document.createElement('div');
    tempDiv.style.cssText = 'position: absolute; visibility: hidden; width: 200px;';
    tempDiv.textContent = text;
    document.body.appendChild(tempDiv);
    const isTruncated = tempDiv.scrollWidth > tempDiv.clientWidth;
    document.body.removeChild(tempDiv);
    return isTruncated;
  };

  const TaskName = () => {
    if (isTextTruncated(name)) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>
            <span className="text-sm font-medium truncate max-w-[200px]">{name}</span>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-sm">{name}</p>
          </TooltipContent>
        </Tooltip>
      );
    }
    return <span className="text-sm font-medium truncate max-w-[200px]">{name}</span>;
  };

  return (
    <div className="grid grid-cols-[2fr,1fr,1.5fr,1fr,1fr] gap-4 items-center px-4 py-2 rounded-md transition-colors group">
      <div className="flex items-center gap-3">
        <TaskName />
        <Button
          variant="ghost"
          size="sm"
          onClick={onDelete}
          className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0 ml-auto"
        >
          <Trash2 className="h-4 w-4 text-destructive" />
        </Button>
      </div>

      <div className="min-w-[100px]">
        <TaskStatusSelect 
          status={taskStatus} 
          onStatusChange={setTaskStatus} 
        />
      </div>

      <div>
        <TaskAssigneeSelect 
          assignee={taskAssignee}
          onAssigneeChange={setTaskAssignee}
        />
      </div>

      <div>
        <TaskDatePicker
          date={taskStartDate}
          onDateChange={setTaskStartDate}
        />
      </div>

      <div>
        <TaskDatePicker
          date={taskEndDate}
          onDateChange={setTaskEndDate}
        />
      </div>
    </div>
  );
};