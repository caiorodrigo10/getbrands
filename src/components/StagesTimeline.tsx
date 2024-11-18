import { useState } from "react";
import { toast } from "sonner";
import { StagesList } from "./stages/StagesList";
import { AddStageButton } from "./stages/AddStageButton";
import { useStagesData } from "./stages/useStagesData";
import { useParams } from "react-router-dom";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/contexts/AuthContext";

export type TaskStatus = "pending" | "in_progress" | "done" | "blocked" | "scheduled" | "not_included";
export type AssigneeType = "none" | string;

export interface Task {
  id: string;
  name: string;
  status: TaskStatus;
  date?: string;
  startDate?: Date;
  endDate?: Date;
  assignee?: AssigneeType;
  position?: number;
  stage_position?: number;
}

export interface Stage {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "pending";
  tasks: Task[];
  position?: number;
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
  const { user } = useAuth();
  const { data: profile } = useProfile(user?.id);
  const isAdmin = profile?.role === "admin";
  
  const {
    stages,
    setStages,
    updateTaskInDatabase,
    addTaskToDatabase,
    deleteTaskFromDatabase,
    addStageToDatabase,
    deleteStageFromDatabase,
    updateStageInDatabase,
    reorderStagesInDatabase,
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
  };

  const handleDeleteTask = async (stageName: string, taskIndex: number) => {
    const taskId = stages.find(s => s.name === stageName)?.tasks[taskIndex]?.id;
    if (!taskId) return;
    await deleteTaskFromDatabase(taskId);
  };

  const handleAddStage = async (stageName: string) => {
    if (!projectId) return;
    await addStageToDatabase(stageName);
    toast.success("Stage added successfully");
  };

  const handleDeleteStage = async (stageName: string) => {
    if (!projectId) return;
    await deleteStageFromDatabase(stageName);
    toast.success("Stage deleted successfully");
  };

  const handleStageUpdate = async (oldStageName: string, newStageName: string, newStatus: Stage["status"]) => {
    if (!projectId) return;
    await updateStageInDatabase(oldStageName, newStageName, newStatus);
    toast.success("Stage updated successfully");
  };

  const handleReorderStages = async (newStages: Stage[]) => {
    if (!projectId) return;
    await reorderStagesInDatabase(newStages);
    setStages(newStages);
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
        onUpdateStage={handleStageUpdate}
        onReorderStages={handleReorderStages}
        isAdmin={isAdmin}
      />
      <AddStageButton onAddStage={handleAddStage} />
    </div>
  );
};

export default StagesTimeline;