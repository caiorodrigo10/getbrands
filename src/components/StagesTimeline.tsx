import { useState } from "react";
import { toast } from "sonner";
import { StagesList } from "./stages/StagesList";
import { AddStageButton } from "./stages/AddStageButton";
import { useStagesData } from "./stages/useStagesData";
import { useParams } from "react-router-dom";

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

export interface Stage {
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
  const { id: projectId } = useParams();
  const {
    stages,
    setStages,
    updateTaskInDatabase,
    addTaskToDatabase,
    deleteTaskFromDatabase,
    addStageToDatabase,
    deleteStageFromDatabase,
  } = useStagesData(projectId || '');
  
  const [openStages, setOpenStages] = useState<string[]>([]);

  const toggleStage = (stageName: string) => {
    setOpenStages(prev => {
      if (prev.includes(stageName)) {
        return prev.filter(name => name !== stageName);
      }
      return [...prev, stageName];
    });
  };

  const handleTaskUpdate = async (stageName: string, taskIndex: number, updates: Partial<Task>) => {
    const taskId = stages.find(s => s.name === stageName)?.tasks[taskIndex]?.id;
    if (!taskId) return;

    await updateTaskInDatabase(taskId, updates);
    
    setStages(prevStages => 
      prevStages.map(stage => {
        if (stage.name === stageName) {
          const updatedTasks = [...stage.tasks];
          updatedTasks[taskIndex] = { ...updatedTasks[taskIndex], ...updates };
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

  const handleAddTask = async (stageName: string, taskData: Task) => {
    if (!projectId) return;
    
    await addTaskToDatabase(stageName, taskData);
    
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
  };

  const handleDeleteTask = async (stageName: string, taskIndex: number) => {
    const taskId = stages.find(s => s.name === stageName)?.tasks[taskIndex]?.id;
    if (!taskId) return;

    await deleteTaskFromDatabase(taskId);
    
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
  };

  const handleAddStage = async (stageName: string) => {
    if (!projectId) return;
    
    await addStageToDatabase(stageName);
    
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

  const handleDeleteStage = async (stageName: string) => {
    if (!projectId) return;
    
    await deleteStageFromDatabase(stageName);
    
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