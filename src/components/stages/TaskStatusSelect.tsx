import { Check, Clock, AlertCircle, Ban, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type TaskStatus = "blocked" | "todo" | "in_progress" | "done" | "scheduled" | "not_included";

interface TaskStatusSelectProps {
  status: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
}

const STATUS_DATA = {
  blocked: {
    label: "Blocked",
    icon: <AlertCircle className="h-3 w-3 text-red-500" />,
  },
  todo: {
    label: "To Do",
    icon: <Clock className="h-3 w-3 text-yellow-500" />,
  },
  in_progress: {
    label: "In Progress",
    icon: <Clock className="h-3 w-3 text-blue-500" />,
  },
  done: {
    label: "Done",
    icon: <Check className="h-3 w-3 text-green-500" />,
  },
  scheduled: {
    label: "Scheduled",
    icon: <Calendar className="h-3 w-3 text-purple-500" />,
  },
  not_included: {
    label: "Not Included",
    icon: <Ban className="h-3 w-3 text-gray-500" />,
  },
};

export const TaskStatusSelect = ({ status, onStatusChange }: TaskStatusSelectProps) => {
  return (
    <Select value={status} onValueChange={(value) => onStatusChange(value as TaskStatus)}>
      <SelectTrigger className="h-7">
        <SelectValue>
          {STATUS_DATA[status].label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Object.entries(STATUS_DATA).map(([key, data]) => (
          <SelectItem key={key} value={key}>
            <div className="flex items-center gap-2">
              {data.icon}
              <span>{data.label}</span>
            </div>
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};