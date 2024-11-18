import { Stage } from "../StagesTimeline";
import { toast } from "sonner";

export const useStageOperations = (projectId: string) => {
  const addStageToDatabase = async (stageName: string) => {
    try {
      // For now, we only update the local state since stages are implicit
      // based on task stage_name values
      toast.success("Stage added successfully");
    } catch (error) {
      console.error('Error adding stage:', error);
      toast.error("Failed to add stage");
      throw error;
    }
  };

  const deleteStageFromDatabase = async (stageName: string) => {
    try {
      // Delete all tasks in this stage
      const { error } = await supabase
        .from('project_tasks')
        .delete()
        .eq('project_id', projectId)
        .eq('stage_name', stageName);

      if (error) throw error;
      toast.success("Stage deleted successfully");
    } catch (error) {
      console.error('Error deleting stage:', error);
      toast.error("Failed to delete stage");
      throw error;
    }
  };

  const updateStageInDatabase = async (oldStageName: string, newStageName: string, newStatus: Stage["status"]) => {
    try {
      const { error } = await supabase
        .from('project_tasks')
        .update({ stage_name: newStageName })
        .eq('project_id', projectId)
        .eq('stage_name', oldStageName);

      if (error) throw error;
      toast.success("Stage updated successfully");
    } catch (error) {
      console.error('Error updating stage:', error);
      toast.error("Failed to update stage");
      throw error;
    }
  };

  return {
    addStageToDatabase,
    deleteStageFromDatabase,
    updateStageInDatabase,
  };
};