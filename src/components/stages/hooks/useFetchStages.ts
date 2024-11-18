import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Stage, Task } from "@/components/StagesTimeline";
import { toast } from "sonner";

export const useFetchStages = (projectId: string) => {
  const [stages, setStages] = useState<Stage[]>([]);

  useEffect(() => {
    const fetchStages = async () => {
      try {
        const { data: stagesData, error: stagesError } = await supabase
          .from('project_stages')
          .select(`
            *,
            project_tasks (
              *,
              assignee:profiles (
                id,
                first_name,
                last_name
              )
            )
          `)
          .eq('project_id', projectId)
          .order('position', { ascending: true });

        if (stagesError) throw stagesError;

        const formattedStages: Stage[] = stagesData.map(stage => ({
          id: stage.id,
          name: stage.name,
          status: stage.status as Stage["status"],
          position: stage.position || 0,
          tasks: (stage.project_tasks || []).map((task: any) => ({
            id: task.id,
            name: task.title,
            status: task.status as Task["status"],
            startDate: task.start_date ? new Date(task.start_date) : undefined,
            endDate: task.due_date ? new Date(task.due_date) : undefined,
            assignee: task.assignee_id || "none",
            position: task.position || 0,
            stageId: stage.id,
          })).sort((a: Task, b: Task) => a.position - b.position),
        }));

        setStages(formattedStages);
      } catch (error) {
        console.error('Error fetching stages:', error);
        toast.error("Failed to load project stages");
      }
    };

    if (projectId) {
      fetchStages();
    }
  }, [projectId]);

  return { stages, setStages };
};