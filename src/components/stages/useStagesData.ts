// Split into multiple files for better organization
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Stage, Task } from "../StagesTimeline";
import { toast } from "sonner";
import { useTaskOperations } from "./useTaskOperations";
import { useStageOperations } from "./useStageOperations";

export const useStagesData = (projectId: string) => {
  const [stages, setStages] = useState<Stage[]>([]);
  const { updateTaskInDatabase, addTaskToDatabase, deleteTaskFromDatabase } = useTaskOperations(projectId);
  const { addStageToDatabase, deleteStageFromDatabase, updateStageInDatabase } = useStageOperations(projectId);

  useEffect(() => {
    if (projectId) {
      fetchStages();
    }
  }, [projectId]);

  const fetchStages = async () => {
    try {
      const { data: tasks, error } = await supabase
        .from('project_tasks')
        .select(`
          *,
          assignee:profiles (
            id,
            first_name,
            last_name
          )
        `)
        .eq('project_id', projectId)
        .order('stage_position', { ascending: true })
        .order('position', { ascending: true });

      if (error) throw error;

      // Group tasks by stage
      const stagesMap = new Map<string, Task[]>();
      tasks?.forEach(task => {
        const stageTasks = stagesMap.get(task.stage_name) || [];
        stagesMap.set(task.stage_name, [...stageTasks, {
          id: task.id,
          name: task.title,
          status: task.status as Task['status'],
          assignee: task.assignee_id || 'none',
          startDate: task.start_date ? new Date(task.start_date) : undefined,
          endDate: task.due_date ? new Date(task.due_date) : undefined,
          position: task.position || 0,
        }]);
      });

      const stagesArray: Stage[] = Array.from(stagesMap.entries()).map(([name, tasks]) => ({
        name,
        status: calculateStageStatus(tasks),
        tasks,
        position: tasks[0]?.stage_position || 0,
      }));

      setStages(stagesArray);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error("Failed to load project tasks");
    }
  };

  const reorderStagesInDatabase = async (newStages: Stage[]) => {
    try {
      const updates = newStages.flatMap((stage, stageIndex) =>
        stage.tasks.map(task => ({
          id: task.id,
          stage_name: stage.name,
          stage_position: stageIndex,
        }))
      );

      const { error } = await supabase
        .from('project_tasks')
        .upsert(updates, { onConflict: 'id' });

      if (error) throw error;
      await fetchStages();
    } catch (error) {
      console.error('Error reordering stages:', error);
      toast.error("Failed to reorder stages");
      throw error;
    }
  };

  return {
    stages,
    setStages,
    updateTaskInDatabase,
    addTaskToDatabase,
    deleteTaskFromDatabase,
    addStageToDatabase,
    deleteStageFromDatabase,
    updateStageInDatabase,
    reorderStagesInDatabase,
  };
};

const calculateStageStatus = (tasks: Task[]): Stage["status"] => {
  if (tasks.length === 0) return "pending";
  
  const allCompleted = tasks.every(task => task.status === "done");
  if (allCompleted) return "completed";
  
  const hasInProgress = tasks.some(task => task.status === "in_progress");
  if (hasInProgress) return "in-progress";
  
  return "pending";
};