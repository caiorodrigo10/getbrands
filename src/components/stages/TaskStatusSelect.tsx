import { Check, Clock, AlertCircle, Ban, Calendar } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";

type TaskStatus = "blocked" | "todo" | "in_progress" | "done" | "scheduled" | "not_included";

interface TaskStatusSelectProps {
  status: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
}

export const TaskStatusSelect = ({ status, onStatusChange }: TaskStatusSelectProps) => {
  const getStatusStyles = (status: TaskStatus) => {
    const styles = {
      blocked: "text-red-500 bg-red-50",
      todo: "text-yellow-500 bg-yellow-50",
      in_progress: "text-blue-500 bg-blue-50",
      done: "text-green-500 bg-green-50",
      scheduled: "text-purple-500 bg-purple-50",
      not_included: "text-gray-500 bg-gray-50",
    };
    return styles[status];
  };

  return (
    <Select value={status} onValueChange={(value) => onStatusChange(value as TaskStatus)}>
      <SelectTrigger className={`h-7 w-[110px] ${getStatusStyles(status)}`}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="todo" className="text-yellow-500">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>To Do</span>
          </div>
        </SelectItem>
        <SelectItem value="in_progress" className="text-blue-500">
          <div className="flex items-center gap-2">
            <Clock className="w-3 h-3" />
            <span>In Progress</span>
          </div>
        </SelectItem>
        <SelectItem value="done" className="text-green-500">
          <div className="flex items-center gap-2">
            <Check className="w-3 h-3" />
            <span>Done</span>
          </div>
        </SelectItem>
        <SelectItem value="blocked" className="text-red-500">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-3 h-3" />
            <span>Blocked</span>
          </div>
        </SelectItem>
        <SelectItem value="scheduled" className="text-purple-500">
          <div className="flex items-center gap-2">
            <Calendar className="w-3 h-3" />
            <span>Scheduled</span>
          </div>
        </SelectItem>
        <SelectItem value="not_included" className="text-gray-500">
          <div className="flex items-center gap-2">
            <Ban className="w-3 h-3" />
            <span>Not Included</span>
          </div>
        </SelectItem>
      </SelectContent>
    </Select>
  );
};