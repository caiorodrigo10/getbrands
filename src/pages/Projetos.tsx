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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Meus Projetos</h1>
      </div>

      <div className="grid gap-6">
        {projects?.map((project) => (
          <Card key={project.id} className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">{project.name}</h2>
                  <p className="text-sm text-muted-foreground">
                    Iniciado em {format(new Date(project.created_at), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-2">Informações do Projeto</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Package className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Produtos vinculados:</span>
                      <span className="font-medium">{project.project_products?.length || 0}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Etapa atual:</span>
                      <span className="font-medium">{project.status}</span>
                    </div>
                  </div>
                </div>

                <ProjectProgress progress={30} />
              </div>

              <div>
                <h3 className="text-sm font-medium mb-4">Timeline do Projeto</h3>
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