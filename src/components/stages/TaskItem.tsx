import { Trash2, Pencil, Check, GripVertical } from "lucide-react";
import { useState } from "react";
import { TaskStatusSelect } from "./TaskStatusSelect";
import { TaskAssigneeSelect } from "./TaskAssigneeSelect";
import { TaskDatePicker } from "./TaskDatePicker";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { type TaskStatus, type AssigneeType, type Task } from "../StagesTimeline";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface TaskItemProps {
  id: string;
  name: string;
  status: TaskStatus;
  date?: string;
  startDate?: Date;
  endDate?: Date;
  assignee?: AssigneeType;
  onUpdate: (updates: Partial<Task>) => void;
  onDelete: () => void;
}

export const TaskItem = ({ 
  id,
  name, 
  status, 
  startDate, 
  endDate, 
  assignee = "none",
  onUpdate,
  onDelete,
}: TaskItemProps) => {
  const [taskStatus, setTaskStatus] = useState<TaskStatus>(status);
  const [taskAssignee, setTaskAssignee] = useState<AssigneeType>(assignee);
  const [taskStartDate, setTaskStartDate] = useState<Date | undefined>(startDate);
  const [taskEndDate, setTaskEndDate] = useState<Date | undefined>(endDate);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    setTaskStatus(newStatus);
    onUpdate({ status: newStatus });
  };

  const handleAssigneeChange = (newAssignee: AssigneeType) => {
    setTaskAssignee(newAssignee);
    onUpdate({ assignee: newAssignee });
  };

  const handleStartDateChange = (date: Date | undefined) => {
    setTaskStartDate(date);
    onUpdate({ startDate: date });
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setTaskEndDate(date);
    onUpdate({ endDate: date });
  };

  const handleNameSave = () => {
    if (editedName.trim() !== "") {
      onUpdate({ name: editedName });
      setIsEditing(false);
    }
  };

  const TaskName = () => {
    if (isEditing) {
      return (
        <div className="flex items-center gap-2">
          <Input
            value={editedName}
            onChange={(e) => setEditedName(e.target.value)}
            className="h-7 w-[200px]"
            autoFocus
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNameSave}
            className="h-7 w-7 p-0"
          >
            <Check className="h-4 w-4" />
          </Button>
        </div>
      );
    }

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
  };

  return (
    <div 
      ref={setNodeRef}
      style={style}
      className="grid grid-cols-[2fr,1fr,1.5fr,1fr,1fr] gap-4 items-center px-4 py-2 rounded-md transition-colors group hover:bg-muted/5"
    >
      <div className="flex items-center gap-3">
        <div {...attributes} {...listeners} className="cursor-grab opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-4 h-4 text-muted-foreground" />
        </div>
        <TaskName />
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          {!isEditing && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-6 w-6 p-0"
            >
              <Pencil className="h-4 w-4" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-6 w-6 p-0"
          >
            <Trash2 className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>

      <div className="min-w-[100px]">
        <TaskStatusSelect 
          status={taskStatus} 
          onStatusChange={handleStatusChange} 
        />
      </div>

      <div>
        <TaskAssigneeSelect 
          assignee={taskAssignee}
          onAssigneeChange={handleAssigneeChange}
        />
      </div>

      <div>
        <TaskDatePicker
          date={taskStartDate}
          onDateChange={handleStartDateChange}
        />
      </div>

      <div>
        <TaskDatePicker
          date={taskEndDate}
          onDateChange={handleEndDateChange}
        />
      </div>
    </div>
  );
};