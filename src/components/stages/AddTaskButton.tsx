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

interface AddTaskButtonProps {
  stageName: string;
  onAddTask: (taskData: Task) => Promise<void>;
}

export const AddTaskButton = ({ stageName, onAddTask }: AddTaskButtonProps) => {
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskName.trim()) {
      return;
    }
    
    const newTask: Task = {
      id: crypto.randomUUID(),
      name: taskName,
      status: "pending" as TaskStatus,
      assignee: "none",
      startDate: new Date(),
      endDate: new Date()
    };
    
    try {
      await onAddTask(newTask);
      setTaskName("");
      setOpen(false);
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
          <div>
            <Input
              placeholder="Task name"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Add Task</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};