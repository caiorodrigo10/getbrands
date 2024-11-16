import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TaskStatus, Task } from "../StagesTimeline";

interface AddTaskButtonProps {
  stageName: string;
  onAddTask: (taskData: Task) => void;
}

export const AddTaskButton = ({ stageName, onAddTask }: AddTaskButtonProps) => {
  const [open, setOpen] = useState(false);
  const [taskName, setTaskName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newTask: Task = {
      id: crypto.randomUUID(),
      name: taskName,
      status: "todo" as TaskStatus,
      assignee: "none",
      startDate: new Date(),
      endDate: new Date()
    };
    await onAddTask(newTask);
    setTaskName("");
    setOpen(false);
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
            <Label htmlFor="taskName">Task Name</Label>
            <Input
              id="taskName"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Enter task name"
            />
          </div>
          <Button type="submit" className="w-full">
            Add Task
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};