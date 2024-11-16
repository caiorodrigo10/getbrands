import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { useState } from "react";
import { TaskStatusSelect } from "./TaskStatusSelect";
import { TaskAssigneeSelect } from "./TaskAssigneeSelect";
import { TaskDatePicker } from "./TaskDatePicker";
import type { Task, TaskStatus } from "../StagesTimeline";

interface AddTaskButtonProps {
  stageName: string;
  onAddTask: (taskData: Task) => void;
}

export const AddTaskButton = ({ stageName, onAddTask }: AddTaskButtonProps) => {
  const [taskName, setTaskName] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [assignee, setAssignee] = useState<string>("none");
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddTask({
      name: taskName,
      status,
      assignee,
      startDate,
      endDate,
    });
    setTaskName("");
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="w-full justify-start px-4 py-2 hover:bg-accent/50">
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <TaskStatusSelect
                status={status}
                onStatusChange={setStatus}
              />
            </div>
            <div>
              <TaskAssigneeSelect
                assignee={assignee}
                onAssigneeChange={setAssignee}
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <TaskDatePicker
                date={startDate}
                onDateChange={setStartDate}
              />
            </div>
            <div>
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