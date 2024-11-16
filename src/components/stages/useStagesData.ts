import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Stage, Task } from "../StagesTimeline";

export const useStagesData = (projectId: string) => {
  const [stages, setStages] = useState<Stage[]>([]);

  const updateTaskInDatabase = async (
    taskId: string,
    updates: Partial<Task>
  ) => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .update({
          status: updates.status,
          assignee_id: updates.assignee === 'none' ? null : updates.assignee,
          due_date: updates.endDate?.toISOString(),
          title: updates.name,
        })
        .eq('id', taskId);

      if (error) throw error;
      toast.success("Task updated successfully");
    } catch (error) {
      console.error('Error updating task:', error);
      toast.error("Failed to update task");
    }
  };

  const addTaskToDatabase = async (
    stageName: string,
    taskData: Task
  ) => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .insert({
          project_id: projectId,
          stage_name: stageName,
          title: taskData.name,
          status: taskData.status,
          assignee_id: taskData.assignee === 'none' ? null : taskData.assignee,
          due_date: taskData.endDate?.toISOString(),
        });

      if (error) throw error;
      toast.success("Task added successfully");
    } catch (error) {
      console.error('Error adding task:', error);
      toast.error("Failed to add task");
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
    }
  };

  return {
    stages,
    setStages,
    updateTaskInDatabase,
    addTaskToDatabase,
    deleteTaskFromDatabase,
  };
};