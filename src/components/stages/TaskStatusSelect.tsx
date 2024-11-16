import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { TaskStatus } from "../StagesTimeline";

interface TaskStatusSelectProps {
  status: TaskStatus;
  onStatusChange: (status: TaskStatus) => void;
}

export const TaskStatusSelect = ({ status, onStatusChange }: TaskStatusSelectProps) => {
  return (
    <Select value={status} onValueChange={value => onStatusChange(value as TaskStatus)}>
      <SelectTrigger className="h-7 w-[130px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="pending">Pending</SelectItem>
        <SelectItem value="in_progress">In Progress</SelectItem>
        <SelectItem value="done">Done</SelectItem>
        <SelectItem value="blocked">Blocked</SelectItem>
        <SelectItem value="scheduled">Scheduled</SelectItem>
        <SelectItem value="not_included">Not Included</SelectItem>
      </SelectContent>
    </Select>
  );
};