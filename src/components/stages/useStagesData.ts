import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Stage, Task } from "../StagesTimeline";

const calculateStageStatus = (tasks: Task[]): Stage["status"] => {
  if (tasks.length === 0) return "pending";
  
  const allCompleted = tasks.every(task => task.status === "done");
  if (allCompleted) return "completed";
  
  const hasInProgress = tasks.some(task => task.status === "in_progress");
  if (hasInProgress) return "in-progress";
  
  return "pending";
};

export const useStagesData = (projectId: string) => {
  const [stages, setStages] = useState<Stage[]>([]);

  useEffect(() => {
    if (projectId) {
      fetchProjectTasks();
    }
  }, [projectId]);

  const fetchProjectTasks = async () => {
    try {
      const { data: tasks, error } = await supabase
        .from('project_tasks')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: true });

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
        }]);
      });

      const stagesArray: Stage[] = Array.from(stagesMap.entries()).map(([name, tasks]) => ({
        name,
        status: calculateStageStatus(tasks),
        tasks,
      }));

      setStages(stagesArray);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast.error("Failed to load project tasks");
    }
  };

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
        })
        .eq('id', taskId);

      if (error) throw error;
      await fetchProjectTasks();
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
        });

      if (error) throw error;
      await fetchProjectTasks();
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
      await fetchProjectTasks();
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error("Failed to delete task");
      throw error;
    }
  };

  const addStageToDatabase = async (stageName: string) => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .insert({
          project_id: projectId,
          stage_name: stageName,
          title: 'Initial Task',
          status: 'todo'
        });

      if (error) throw error;
      await fetchProjectTasks();
      toast.success("Stage added successfully");
    } catch (error) {
      console.error('Error adding stage:', error);
      toast.error("Failed to add stage");
      throw error;
    }
  };

  const deleteStageFromDatabase = async (stageName: string) => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .delete()
        .eq('project_id', projectId)
        .eq('stage_name', stageName);

      if (error) throw error;
      await fetchProjectTasks();
      toast.success("Stage deleted successfully");
    } catch (error) {
      console.error('Error deleting stage:', error);
      toast.error("Failed to delete stage");
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
  };
};