import { Check, Clock, AlertCircle, Ban, Calendar } from "lucide-react";
import { useState } from "react";
import { TaskStatusSelect } from "./TaskStatusSelect";
import { TaskAssigneeSelect } from "./TaskAssigneeSelect";
import { TaskDatePicker } from "./TaskDatePicker";

type TaskStatus = "blocked" | "todo" | "in_progress" | "done" | "scheduled" | "not_included";
type AssigneeType = "client" | "account_manager" | "designer" | "none";

interface TaskItemProps {
  name: string;
  status: TaskStatus;
  date?: string;
  startDate?: Date;
  endDate?: Date;
  assignee?: AssigneeType;
  onUpdate: (newName: string) => void;
}

const getStatusIcon = (status: TaskStatus) => {
  switch (status) {
    case "blocked":
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case "done":
      return <Check className="w-4 h-4 text-green-500" />;
    case "in_progress":
      return <Clock className="w-4 h-4 text-blue-500" />;
    case "scheduled":
      return <Calendar className="w-4 h-4 text-purple-500" />;
    case "not_included":
      return <Ban className="w-4 h-4 text-gray-500" />;
    default:
      return <Clock className="w-4 h-4 text-yellow-500" />;
  }
};

export const TaskItem = ({ 
  name, 
  status, 
  startDate, 
  endDate, 
  assignee = "none",
  onUpdate 
}: TaskItemProps) => {
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(status);
  const [taskAssignee, setTaskAssignee] = useState<AssigneeType>(assignee);
  const [taskStartDate, setTaskStartDate] = useState<Date | undefined>(startDate);
  const [taskEndDate, setTaskEndDate] = useState<Date | undefined>(endDate);

  return (
    <div className="flex items-center gap-4 p-3 rounded-md bg-background/50 hover:bg-background/80 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        {getStatusIcon(taskStatus)}
        <span className="text-sm font-medium truncate">{name}</span>
      </div>
      
      <div className="flex items-center gap-4 ml-auto">
        <TaskStatusSelect 
          status={taskStatus} 
          onStatusChange={setTaskStatus} 
        />
        
        <TaskAssigneeSelect 
          assignee={taskAssignee} 
          onAssigneeChange={setTaskAssignee} 
        />

        <div className="flex items-center gap-4">
          <TaskDatePicker
            label="Start"
            date={taskStartDate}
            onDateChange={setTaskStartDate}
          />
          <TaskDatePicker
            label="End"
            date={taskEndDate}
            onDateChange={setTaskEndDate}
          />
        </div>
      </div>
    </div>
  );
};