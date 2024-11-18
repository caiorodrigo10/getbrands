import { Stage, Task } from "../StagesTimeline";
import { useFetchStages } from "./hooks/useFetchStages";
import { useStageOperations } from "./hooks/useStageOperations";
import { useTaskOperations } from "./hooks/useTaskOperations";

export const useStagesData = (projectId: string) => {
  const { stages, setStages } = useFetchStages(projectId);
  const { addStageToDatabase, deleteStageFromDatabase, updateStagePositions } = useStageOperations();
  const { updateTaskInDatabase, addTaskToDatabase, deleteTaskFromDatabase, updateTaskPositions } = useTaskOperations(projectId);

  const handleAddStage = async (stageName: string) => {
    const newStage = await addStageToDatabase(projectId, stageName);
    if (newStage) {
      setStages(prev => [...prev, {
        id: newStage.id,
        name: newStage.name,
        status: newStage.status as Stage["status"],
        position: newStage.position,
        tasks: [],
      }]);
    }
  };

  return {
    stages,
    setStages,
    updateTaskInDatabase,
    addTaskToDatabase,
    deleteTaskFromDatabase,
    addStageToDatabase: handleAddStage,
    deleteStageFromDatabase,
    updateStagePositions,
    updateTaskPositions,
  };
};