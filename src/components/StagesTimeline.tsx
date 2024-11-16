import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./ui/accordion";
import { TaskItem } from "./stages/TaskItem";
import { StageHeader } from "./stages/StageHeader";
import { AddTaskButton } from "./stages/AddTaskButton";
import { AddStageButton } from "./stages/AddStageButton";
import { StageActions } from "./stages/StageActions";
import { useState } from "react";
import { toast } from "sonner";

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

const StagesTimeline = () => {
  const [stages, setStages] = useState<Stage[]>([
    {
      name: "Onboarding",
      status: "completed",
      tasks: [
        { 
          id: "1",
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
          id: "2",
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
          id: "3",
          name: "Client Fill Naming Brief Form",
          status: "done",
          date: "18/03/2024",
          startDate: new Date("2024-03-18"),
          endDate: new Date("2024-03-18"),
          assignee: "none"
        },
        {
          id: "4",
          name: "Team Archived Name Options for Client",
          status: "in_progress",
          date: "In Progress",
          startDate: new Date("2024-03-20"),
          assignee: "none"
        },
        {
          id: "5",
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
          id: "6",
          name: "Client Fill Visual Identity Form",
          status: "blocked",
          assignee: "none"
        },
        {
          id: "7",
          name: "Team Completed Visual Identity and Archived Presentation",
          status: "todo",
          assignee: "none"
        },
        {
          id: "8",
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
    setStages(prevStages =>
      prevStages.map(stage => {
        if (stage.name === stageName) {
          const newTasks = [...stage.tasks, taskData];
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
      <div className="space-y-4">
        {stages.map((stage) => (
          <AccordionItem 
            key={stage.name} 
            value={stage.name}
            className="border rounded-lg bg-card"
          >
            <div className="flex items-center justify-between px-4">
              <div 
                className="flex-1 cursor-pointer py-4"
                onClick={() => toggleStage(stage.name)}
              >
                <StageHeader name={stage.name} status={stage.status} />
              </div>
              <StageActions onDeleteStage={() => handleDeleteStage(stage.name)} />
            </div>
            {openStages.includes(stage.name) && (
              <div className="pb-3">
                <div className="space-y-1">
                  <div className="grid grid-cols-[2fr,1fr,1.5fr,1fr,1fr] gap-4 px-4 py-2 text-sm font-medium text-muted-foreground">
                    <div>Task</div>
                    <div>Status</div>
                    <div>Assignee</div>
                    <div>Start</div>
                    <div>End</div>
                  </div>
                  
                  {stage.tasks.map((task, taskIndex) => (
                    <TaskItem
                      key={taskIndex}
                      id={task.id}
                      name={task.name}
                      status={task.status}
                      date={task.date}
                      startDate={task.startDate}
                      endDate={task.endDate}
                      assignee={task.assignee}
                      onUpdate={(newName) => handleTaskUpdate(stage.name, taskIndex, newName)}
                      onDelete={() => handleDeleteTask(stage.name, taskIndex)}
                    />
                  ))}
                  
                  <AddTaskButton 
                    stageName={stage.name}
                    onAddTask={(taskData) => handleAddTask(stage.name, taskData)}
                  />
                </div>
              </div>
            )}
          </AccordionItem>
        ))}
      </div>
      
      <AddStageButton onAddStage={handleAddStage} />
    </div>
  );
};

export default StagesTimeline;
