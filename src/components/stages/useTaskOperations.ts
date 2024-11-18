import { supabase } from "@/integrations/supabase/client";
import { Task } from "../StagesTimeline";
import { toast } from "sonner";

export const useTaskOperations = (projectId: string) => {
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
      toast.success("Task updated successfully");
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error("Failed to update task");
      throw error;
    }
  };

  const addTaskToDatabase = async (stageName: string, taskData: Task): Promise<void> => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .insert({
          project_id: projectId,
          stage_name: stageName,
          title: taskData.name,
          status: taskData.status,
          assignee_id: taskData.assignee === 'none' ? null : taskData.assignee,
          start_date: taskData.startDate?.toISOString(),
          due_date: taskData.endDate?.toISOString(),
          position: taskData.position,
        });

      if (error) throw error;
      toast.success("Task added successfully");
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
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error("Failed to delete task");
      throw error;
    }
  };

  return {
    updateTaskInDatabase,
    addTaskToDatabase,
    deleteTaskFromDatabase,
  };
};