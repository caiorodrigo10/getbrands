import { useState } from "react";
import { toast } from "sonner";
import { StagesList } from "./stages/StagesList";
import { AddStageButton } from "./stages/AddStageButton";

export type TaskStatus = "blocked" | "todo" | "in_progress" | "done" | "scheduled" | "not_included";
export type AssigneeType = "none" | string;

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  date?: string;
  startDate?: Date;
  endDate?: Date;
  assignee?: AssigneeType;
}

interface Stage {
  name: string;
  status: "completed" | "in-progress" | "pending";
  tasks: Task[];
}

const calculateStageStatus = (tasks: Task[]): Stage["status"] => {
  if (tasks.length === 0) return "pending";
  
  const allCompleted = tasks.every(task => task.status === "done");
  if (allCompleted) return "completed";
  
  const hasInProgress = tasks.some(task => task.status === "in_progress");
  if (hasInProgress) return "in-progress";
  
  return "pending";
};

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const StagesTimeline = () => {
  const [stages, setStages] = useState<Stage[]>([
    {
      name: "Onboarding",
      status: "completed",
      tasks: [
        { 
          id: generateUUID(),
          name: "Welcome Meeting",
          status: "done",
          date: "10/03/2024",
          startDate: new Date("2024-03-10"),
          endDate: new Date("2024-03-10"),
          assignee: "none"
        }
      ]
    },
    {
      name: "Product Selection",
      status: "completed",
      tasks: [
        {
          id: generateUUID(),
          name: "Client Successfully Selected Products",
          status: "done",
          date: "15/03/2024",
          startDate: new Date("2024-03-15"),
          endDate: new Date("2024-03-15"),
          assignee: "none"
        }
      ]
    },
    {
      name: "Naming",
      status: "in-progress",
      tasks: [
        {
          id: generateUUID(),
          name: "Client Fill Naming Brief Form",
          status: "done",
          date: "18/03/2024",
          startDate: new Date("2024-03-18"),
          endDate: new Date("2024-03-18"),
          assignee: "none"
        },
        {
          id: generateUUID(),
          name: "Team Archived Name Options for Client",
          status: "in_progress",
          date: "In Progress",
          startDate: new Date("2024-03-20"),
          assignee: "none"
        },
        {
          id: generateUUID(),
          name: "Client Approved Name",
          status: "todo",
          assignee: "none"
        }
      ]
    },
    {
      name: "Visual Identity",
      status: "pending",
      tasks: [
        {
          id: generateUUID(),
          name: "Client Fill Visual Identity Form",
          status: "blocked",
          assignee: "none"
        },
        {
          id: generateUUID(),
          name: "Team Completed Visual Identity and Archived Presentation",
          status: "todo",
          assignee: "none"
        },
        {
          id: generateUUID(),
          name: "Client Approved Visual Identity",
          status: "todo",
          assignee: "none"
        }
      ]
    }
  ]);

  const [openStages, setOpenStages] = useState<string[]>([]);

  const toggleStage = (stageName: string) => {
    setOpenStages(prev => {
      if (prev.includes(stageName)) {
        return prev.filter(name => name !== stageName);
      }
      return [...prev, stageName];
    });
  };

  const handleTaskUpdate = (stageName: string, taskIndex: number, newName: string) => {
    setStages(prevStages => 
      prevStages.map(stage => {
        if (stage.name === stageName) {
          const updatedTasks = [...stage.tasks];
          updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], name: newName };
          return {
            ...stage,
            tasks: updatedTasks,
            status: calculateStageStatus(updatedTasks)
          };
        }
        return stage;
      })
    );
  };

  const handleAddTask = (stageName: string, taskData: Task) => {
    const taskWithUUID = {
      ...taskData,
      id: generateUUID()
    };
    
    setStages(prevStages =>
      prevStages.map(stage => {
        if (stage.name === stageName) {
          const newTasks = [...stage.tasks, taskWithUUID];
          return {
            ...stage,
            tasks: newTasks,
            status: calculateStageStatus(newTasks)
          };
        }
        return stage;
      })
    );
    toast.success("Task added successfully");
  };

  const handleDeleteTask = (stageName: string, taskIndex: number) => {
    setStages(prevStages =>
      prevStages.map(stage => {
        if (stage.name === stageName) {
          const newTasks = stage.tasks.filter((_, index) => index !== taskIndex);
          return {
            ...stage,
            tasks: newTasks,
            status: calculateStageStatus(newTasks)
          };
        }
        return stage;
      })
    );
    toast.success("Task deleted successfully");
  };

  const handleAddStage = (stageName: string) => {
    setStages(prevStages => [
      ...prevStages,
      {
        name: stageName,
        status: "pending",
        tasks: []
      }
    ]);
    toast.success("Stage added successfully");
  };

  const handleDeleteStage = (stageName: string) => {
    setStages(prevStages => prevStages.filter(stage => stage.name !== stageName));
    toast.success("Stage deleted successfully");
  };

  return (
    <div className="space-y-4">
      <StagesList
        stages={stages}
        openStages={openStages}
        onToggleStage={toggleStage}
        onTaskUpdate={handleTaskUpdate}
        onAddTask={handleAddTask}
        onDeleteTask={handleDeleteTask}
        onDeleteStage={handleDeleteStage}
      />
      <AddStageButton onAddStage={handleAddStage} />
    </div>
  );
};

export default StagesTimeline;