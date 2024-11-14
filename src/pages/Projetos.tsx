import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ProjectProgress from "@/components/ProjectProgress";
import StagesTimeline from "@/components/StagesTimeline";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { Package } from "lucide-react";

const Projetos = () => {
  const { user } = useAuth();
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data: projectsData, error: projectsError } = await supabase
        .from("projects")
        .select(`
          *,
          project_products (
            id
          )
        `)
        .eq('user_id', user?.id)
        .order("created_at", { ascending: false });

      if (projectsError) throw projectsError;
      return projectsData;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return <div>Carregando projetos...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Meus Projetos</h1>

      <div className="grid gap-4">
        {projects?.map((project) => (
          <Card key={project.id} className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <h2 className="text-lg font-semibold">{project.name}</h2>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(project.created_at), "dd/MM/yyyy", { locale: ptBR })}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Package className="w-4 h-4" />
                      <span>{project.project_products?.length || 0} produtos</span>
                    </div>
                    <span>•</span>
                    <span>Etapa: {project.status}</span>
                  </div>
                </div>

                <ProjectProgress progress={30} />
              </div>

              <div className="border-t md:border-t-0 md:border-l border-border/50 pt-4 md:pt-0 md:pl-6">
                <StagesTimeline />
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Projetos;