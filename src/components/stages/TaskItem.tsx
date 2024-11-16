import { Check, Clock, AlertCircle, Ban, Calendar, User2 } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { format } from "date-fns";

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

const getStatusBadge = (status: TaskStatus) => {
  const styles = {
    blocked: "bg-red-100 text-red-800",
    todo: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-blue-100 text-blue-800",
    done: "bg-green-100 text-green-800",
    scheduled: "bg-purple-100 text-purple-800",
    not_included: "bg-gray-100 text-gray-800",
  };

  const labels = {
    blocked: "Blocked",
    todo: "To Do",
    in_progress: "In Progress",
    done: "Done",
    scheduled: "Scheduled",
    not_included: "Not Included",
  };

  return (
    <Badge className={`${styles[status]} font-medium`}>
      {labels[status]}
    </Badge>
  );
};

const getAssigneeLabel = (assignee: AssigneeType) => {
  const labels = {
    client: "Client",
    account_manager: "Account Manager",
    designer: "Designer",
    none: "Unassigned"
  };
  return labels[assignee];
};

export const TaskItem = ({ 
  name, 
  status, 
  date, 
  startDate, 
  endDate, 
  assignee = "none",
  onUpdate 
}: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskName, setTaskName] = useState(name);
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(status);
  const [taskAssignee, setTaskAssignee] = useState<AssigneeType>(assignee);
  const [taskStartDate, setTaskStartDate] = useState<Date | undefined>(startDate);
  const [taskEndDate, setTaskEndDate] = useState<Date | undefined>(endDate);

  const handleSave = () => {
    onUpdate(taskName);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-2 p-3 rounded-md bg-background/50 hover:bg-background/80 transition-colors group">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-grow min-w-0">
          {getStatusIcon(taskStatus)}
          {isEditing ? (
            <div className="flex-grow flex gap-2">
              <Input
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                className="h-8"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSave();
                  if (e.key === "Escape") setIsEditing(false);
                }}
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="h-8"
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="h-8"
              >
                Cancel
              </Button>
            </div>
          ) : (
            <span 
              className="text-sm flex-grow cursor-pointer hover:text-primary transition-colors"
              onClick={() => setIsEditing(true)}
            >
              {name}
            </span>
          )}
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
          <Select value={taskStatus} onValueChange={(value) => setTaskStatus(value as TaskStatus)}>
            <SelectTrigger className="h-8 w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todo">To Do</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="blocked">Blocked</SelectItem>
              <SelectItem value="scheduled">Scheduled</SelectItem>
              <SelectItem value="not_included">Not Included</SelectItem>
            </SelectContent>
          </Select>

          <Select value={taskAssignee} onValueChange={(value) => setTaskAssignee(value as AssigneeType)}>
            <SelectTrigger className="h-8 w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">Unassigned</SelectItem>
              <SelectItem value="client">Client</SelectItem>
              <SelectItem value="account_manager">Account Manager</SelectItem>
              <SelectItem value="designer">Designer</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="flex items-center gap-4 ml-7">
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">Start:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7">
                {taskStartDate ? format(taskStartDate, "MMM dd, yyyy") : "Set date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={taskStartDate}
                onSelect={setTaskStartDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">End:</span>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="h-7">
                {taskEndDate ? format(taskEndDate, "MMM dd, yyyy") : "Set date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <CalendarComponent
                mode="single"
                selected={taskEndDate}
                onSelect={setTaskEndDate}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};