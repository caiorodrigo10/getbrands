import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { StagesTimeline } from "@/components/StagesTimeline";
import { useStagesData } from "@/components/stages/useStagesData";

const ProjectDetailsV2 = () => {
  const { id } = useParams();
  const { stages, isLoading } = useStagesData(id || '');

  const { data: project } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  if (!id || isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">{project?.name}</h1>
        <p className="text-muted-foreground">{project?.description}</p>
      </div>

      <StagesTimeline
        projectId={id}
        stages={stages}
      />
    </div>
  );
};

export default ProjectDetailsV2;