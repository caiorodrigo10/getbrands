import { Check, Clock, AlertCircle, Ban, Calendar } from "lucide-react";
import { Badge } from "../ui/badge";
import { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

type TaskStatus = "blocked" | "todo" | "in_progress" | "done" | "scheduled" | "not_included";

interface TaskItemProps {
  name: string;
  status: TaskStatus;
  date?: string;
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

export const TaskItem = ({ name, status, date, onUpdate }: TaskItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [taskName, setTaskName] = useState(name);

  const handleSave = () => {
    onUpdate(taskName);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between gap-4 p-3 rounded-md bg-background/50 hover:bg-background/80 transition-colors group">
      <div className="flex items-center gap-3 flex-grow min-w-0">
        {getStatusIcon(status)}
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
      <div className="flex items-center gap-3 flex-shrink-0">
        {date && (
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {date}
          </span>
        )}
        {getStatusBadge(status)}
      </div>
    </div>
  );
};