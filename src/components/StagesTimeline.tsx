import { useState, useRef, useEffect } from "react";
import { toast } from "sonner";
import { StagesList } from "./stages/StagesList";
import { AddStageButton } from "./stages/AddStageButton";
import { useStagesData } from "./stages/useStagesData";
import { useParams } from "react-router-dom";
import Sortable from "sortablejs";

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
  position: number;
  stageId: string;
  title?: string; // Added for database compatibility
}

export interface Stage {
  id: string;
  name: string;
  status: "completed" | "in-progress" | "pending";
  tasks: Task[];
  position: number;
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
  const stagesListRef = useRef<HTMLDivElement>(null);
  
  const {
    stages,
    setStages,
    updateTaskInDatabase,
    addTaskToDatabase,
    deleteTaskFromDatabase,
    addStageToDatabase,
    deleteStageFromDatabase,
    updateStagePositions,
    updateTaskPositions,
  } = useStagesData(projectId || '');
  
  const [openStages, setOpenStages] = useState<string[]>([]);

  useEffect(() => {
    if (stagesListRef.current) {
      const sortable = new Sortable(stagesListRef.current, {
        animation: 150,
        handle: ".stage-handle",
        onEnd: async (evt) => {
          const newStages = [...stages];
          const movedStage = newStages.splice(evt.oldIndex!, 1)[0];
          newStages.splice(evt.newIndex!, 0, movedStage);
          
          // Update positions
          const updatedStages = newStages.map((stage, index) => ({
            ...stage,
            position: index,
          }));
          
          setStages(updatedStages);
          await updateStagePositions(updatedStages);
          toast.success("Stage order updated");
        },
      });

      return () => {
        sortable.destroy();
      };
    }
  }, [stages, updateStagePositions]);

  const toggleStage = (stageId: string) => {
    setOpenStages(prev => {
      if (prev.includes(stageId)) {
        return prev.filter(id => id !== stageId);
      }
      return [...prev, stageId];
    });
  };

  const handleTaskUpdate = async (stageId: string, taskId: string, updates: Partial<Task>) => {
    await updateTaskInDatabase(taskId, updates);
    
    setStages(prevStages => 
      prevStages.map(stage => {
        if (stage.id === stageId) {
          const updatedTasks = stage.tasks.map(task => 
            task.id === taskId ? { ...task, ...updates } : task
          );
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

  const handleAddTask = async (stageId: string, taskData: Task) => {
    if (!projectId) return;
    await addTaskToDatabase(stageId, taskData);
  };

  const handleDeleteTask = async (stageId: string, taskId: string) => {
    await deleteTaskFromDatabase(taskId);
  };

  const handleAddStage = async (stageName: string) => {
    if (!projectId) return;
    
    await addStageToDatabase(stageName);
    toast.success("Stage added successfully");
  };

  const handleDeleteStage = async (stageId: string) => {
    if (!projectId) return;
    
    await deleteStageFromDatabase(stageId);
    toast.success("Stage deleted successfully");
  };

  return (
    <div className="space-y-4">
      <div ref={stagesListRef}>
        <StagesList
          stages={stages}
          openStages={openStages}
          onToggleStage={toggleStage}
          onTaskUpdate={handleTaskUpdate}
          onAddTask={handleAddTask}
          onDeleteTask={handleDeleteTask}
          onDeleteStage={handleDeleteStage}
          onUpdateTaskPositions={updateTaskPositions}
        />
      </div>
      <AddStageButton onAddStage={handleAddStage} />
    </div>
  );
};

export default StagesTimeline;
