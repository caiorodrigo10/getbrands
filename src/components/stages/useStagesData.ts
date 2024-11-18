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
      const { data: stagesData, error: stagesError } = await supabase
        .from('project_stages')
        .select('*')
        .eq('project_id', projectId)
        .order('position', { ascending: true });

      if (stagesError) throw stagesError;

      const { data: tasks, error: tasksError } = await supabase
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
        .order('position', { ascending: true });

      if (tasksError) throw tasksError;

      const formattedStages: Stage[] = stagesData.map(stage => ({
        id: stage.id,
        name: stage.name,
        status: stage.status as Stage["status"],
        position: stage.position,
        tasks: tasks
          .filter(task => task.stage_id === stage.id)
          .map(task => ({
            id: task.id,
            name: task.title,
            status: task.status as Task["status"],
            startDate: task.start_date ? new Date(task.start_date) : undefined,
            endDate: task.due_date ? new Date(task.due_date) : undefined,
            assignee: task.assignee_id || 'none',
            position: task.position,
            stage_position: task.stage_position,
          })),
      }));

      setStages(formattedStages);
    } catch (error) {
      console.error('Error fetching stages:', error);
      toast.error("Failed to load project stages");
    }
  };

  const reorderStagesInDatabase = async (newStages: Stage[]) => {
    try {
      const updates = newStages.map((stage, index) => ({
        id: stage.id,
        position: index,
      }));

      const { error } = await supabase
        .from('project_stages')
        .upsert(updates);

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