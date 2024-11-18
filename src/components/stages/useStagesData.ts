import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Stage, Task } from "../StagesTimeline";

export const useStagesData = (projectId: string) => {
  const [stages, setStages] = useState<Stage[]>([]);

  const fetchProjectStages = useCallback(async () => {
    try {
      const { data: stagesData, error: stagesError } = await supabase
        .from('project_stages')
        .select('*')
        .eq('project_id', projectId)
        .order('position', { ascending: true });

      if (stagesError) throw stagesError;

      const { data: tasksData, error: tasksError } = await supabase
        .from('project_tasks')
        .select(`
          *,
          assignee:profiles (
            id,
            first_name,
            last_name,
            avatar_url
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
        tasks: tasksData
          .filter(task => task.stage_id === stage.id)
          .map(task => ({
            id: task.id,
            name: task.title,
            status: task.status as Task["status"],
            startDate: task.start_date ? new Date(task.start_date) : undefined,
            endDate: task.due_date ? new Date(task.due_date) : undefined,
            assignee: task.assignee_id || "none",
            position: task.position,
            stageId: task.stage_id,
          })),
      }));

      setStages(formattedStages);
    } catch (error) {
      console.error('Error fetching stages:', error);
      toast.error("Failed to load project stages");
    }
  }, [projectId]);

  const updateTaskInDatabase = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .update({
          status: updates.status,
          assignee_id: updates.assignee === 'none' ? null : updates.assignee,
          due_date: updates.endDate?.toISOString(),
          start_date: updates.startDate?.toISOString(),
          title: updates.name,
          position: updates.position,
        })
        .eq('id', taskId);

      if (error) throw error;
      await fetchProjectStages();
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error("Failed to update task");
      throw error;
    }
  };

  const addTaskToDatabase = async (stageId: string, taskData: Task) => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .insert({
          project_id: projectId,
          stage_id: stageId,
          title: taskData.name,
          status: taskData.status,
          assignee_id: taskData.assignee === 'none' ? null : taskData.assignee,
          start_date: taskData.startDate?.toISOString(),
          due_date: taskData.endDate?.toISOString(),
          position: taskData.position,
        });

      if (error) throw error;
      await fetchProjectStages();
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error("Failed to add task");
      throw error;
    }
  };

  const deleteTaskFromDatabase = async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      await fetchProjectStages();
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error("Failed to delete task");
      throw error;
    }
  };

  const addStageToDatabase = async (stageName: string) => {
    try {
      const position = stages.length;
      const { error } = await supabase
        .from('project_stages')
        .insert({
          project_id: projectId,
          name: stageName,
          status: 'pending',
          position,
        });

      if (error) throw error;
      await fetchProjectStages();
    } catch (error) {
      console.error('Error adding stage:', error);
      toast.error("Failed to add stage");
      throw error;
    }
  };

  const deleteStageFromDatabase = async (stageId: string) => {
    try {
      const { error } = await supabase
        .from('project_stages')
        .delete()
        .eq('id', stageId);

      if (error) throw error;
      await fetchProjectStages();
    } catch (error) {
      console.error('Error deleting stage:', error);
      toast.error("Failed to delete stage");
      throw error;
    }
  };

  const updateStagePositions = async (updatedStages: Stage[]) => {
    try {
      const { error } = await supabase
        .from('project_stages')
        .upsert(
          updatedStages.map((stage, index) => ({
            id: stage.id,
            position: index,
          }))
        );

      if (error) throw error;
      await fetchProjectStages();
    } catch (error) {
      console.error('Error updating stage positions:', error);
      toast.error("Failed to update stage positions");
    }
  };

  const updateTaskPositions = async (stageId: string, updatedTasks: Task[]) => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .upsert(
          updatedTasks.map((task, index) => ({
            id: task.id,
            position: index,
            stage_id: stageId,
          }))
        );

      if (error) throw error;
      await fetchProjectStages();
    } catch (error) {
      console.error('Error updating task positions:', error);
      toast.error("Failed to update task positions");
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
    updateStagePositions,
    updateTaskPositions,
  };
};