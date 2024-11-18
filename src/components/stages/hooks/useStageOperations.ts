import { supabase } from "@/integrations/supabase/client";
import { Stage } from "@/components/StagesTimeline";
import { toast } from "sonner";

export const useStageOperations = () => {
  const addStageToDatabase = async (projectId: string, stageName: string) => {
    try {
      const { data, error } = await supabase
        .from('project_stages')
        .insert({
          project_id: projectId,
          name: stageName,
          status: 'pending',
          position: 0,
        })
        .select()
        .single();

      if (error) throw error;
      return data;
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
    } catch (error) {
      console.error('Error deleting stage:', error);
      toast.error("Failed to delete stage");
      throw error;
    }
  };

  const updateStagePositions = async (stages: Stage[]) => {
    try {
      const { error } = await supabase
        .from('project_stages')
        .upsert(
          stages.map(stage => ({
            id: stage.id,
            name: stage.name,
            position: stage.position,
            status: stage.status,
          }))
        );

      if (error) throw error;
    } catch (error) {
      console.error('Error updating stage positions:', error);
      toast.error("Failed to update stage positions");
      throw error;
    }
  };

  return {
    addStageToDatabase,
    deleteStageFromDatabase,
    updateStagePositions,
  };
};