import { supabase } from "@/integrations/supabase/client";
import { Task } from "@/components/StagesTimeline";
import { toast } from "sonner";

export const useTaskOperations = (projectId: string) => {
  const updateTaskInDatabase = async (taskId: string, updates: Partial<Task>) => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .update({
          title: updates.name,
          status: updates.status,
          assignee_id: updates.assignee === 'none' ? null : updates.assignee,
          start_date: updates.startDate?.toISOString(),
          due_date: updates.endDate?.toISOString(),
          position: updates.position,
          stage_id: updates.stageId,
        })
        .eq('id', taskId);

      if (error) throw error;
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
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error("Failed to delete task");
      throw error;
    }
  };

  const updateTaskPositions = async (stageId: string, tasks: Task[]) => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .upsert(
          tasks.map(task => ({
            id: task.id,
            title: task.name,
            position: task.position,
            stage_id: stageId,
            status: task.status,
          }))
        );

      if (error) throw error;
    } catch (error) {
      console.error('Error updating task positions:', error);
      toast.error("Failed to update task positions");
      throw error;
    }
  };

  return {
    updateTaskInDatabase,
    addTaskToDatabase,
    deleteTaskFromDatabase,
    updateTaskPositions,
  };
};