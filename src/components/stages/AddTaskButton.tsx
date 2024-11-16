import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import { Task, TaskStatus } from "../StagesTimeline";
import { TaskStatusSelect } from "./TaskStatusSelect";
import { TaskAssigneeSelect } from "./TaskAssigneeSelect";
import { TaskDatePicker } from "./TaskDatePicker";

interface AddTaskButtonProps {
  stageName: string;
  onAddTask: (taskData: Task) => Promise<void>;
}

export const AddTaskButton = ({ stageName, onAddTask }: AddTaskButtonProps) => {
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState("");
  const [status, setStatus] = useState<TaskStatus>("pending");
  const [assignee, setAssignee] = useState<"none" | string>("none");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      toast.error("Task name is required");
      return;
    }
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      name: taskName,
      status,
      assignee,
      startDate,
      endDate
    };
    
    try {
      await onAddTask(newTask);
      setTaskName("");
      setStatus("pending");
      setAssignee("none");
      setStartDate(undefined);
      setEndDate(undefined);
      setOpen(false);
      toast.success("Task added successfully");
    } catch (error) {
      console.error('Failed to add task:', error);
      toast.error("Failed to add task");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Task to {stageName}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="taskName" className="text-sm font-medium">
              Task Name
            </label>
            <Input
              id="taskName"
              placeholder="Enter task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <TaskStatusSelect 
              status={status} 
              onStatusChange={setStatus} 
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Assignee</label>
            <TaskAssigneeSelect 
              assignee={assignee}
              onAssigneeChange={setAssignee}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Start Date</label>
              <TaskDatePicker
                date={startDate}
                onDateChange={setStartDate}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">End Date</label>
              <TaskDatePicker
                date={endDate}
                onDateChange={setEndDate}
              />
            </div>
          </div>

          <Button type="submit" className="w-full">Add Task</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};