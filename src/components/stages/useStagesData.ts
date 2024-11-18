import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Task } from "../StagesTimeline";

export const useStagesData = (projectId: string) => {
  const { data: stagesData, isLoading: isLoadingStages } = useQuery({
    queryKey: ['project-stages', projectId],
    queryFn: async () => {
      const { data: stages, error: stagesError } = await supabase
        .from('project_stages')
        .select(`
          id,
          name,
          status,
          position,
          project_tasks (
            id,
            title,
            description,
            status,
            position,
            start_date,
            due_date,
            assignee:assignee_id (
              id,
              first_name,
              last_name,
              email
            )
          )
        `)
        .eq('project_id', projectId)
        .order('position');

      if (stagesError) throw stagesError;
      return stages;
    },
  });

  const stages = stagesData?.map(stage => {
    const tasks = stage.project_tasks?.map(task => ({
      id: task.id,
      name: task.title,
      description: task.description,
      status: task.status,
      position: task.position,
      startDate: task.start_date ? new Date(task.start_date) : undefined,
      endDate: task.due_date ? new Date(task.due_date) : undefined,
      assignee: task.assignee?.id || 'none',
      assigneeName: task.assignee ? `${task.assignee.first_name} ${task.assignee.last_name}` : 'Unassigned'
    })) || [];

    return {
      id: stage.id,
      name: stage.name,
      tasks: tasks.sort((a, b) => (a.position || 0) - (b.position || 0)),
      status: stage.status
    };
  }) || [];

  return {
    stages: stages.sort((a, b) => (a.position || 0) - (b.position || 0)),
    isLoading: isLoadingStages
  };
};