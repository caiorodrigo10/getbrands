import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import ProjectProgress from "@/components/ProjectProgress";
import StagesTimeline from "@/components/StagesTimeline";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

const Projetos = () => {
  const { user } = useAuth();
  
  const { data: projects, isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq('user_id', user?.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (isLoading) {
    return <div>Carregando projetos...</div>;
  }

  // Calculate progress based on status
  const getProjectProgress = (status: string) => {
    const stages = ["onboarding", "selecao_produto", "naming", "identidade_visual", "embalagens", "ecommerce"];
    const currentIndex = stages.indexOf(status);
    return Math.round(((currentIndex + 1) / stages.length) * 100);
  };

  // Get current stage display name
  const getStageDisplayName = (status: string) => {
    const stageNames: { [key: string]: string } = {
      onboarding: "Onboarding",
      selecao_produto: "Seleção de Produtos",
      naming: "Naming",
      identidade_visual: "Identidade Visual",
      embalagens: "Criação de Embalagens",
      ecommerce: "E-commerce",
    };
    return stageNames[status] || status;
  };

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
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Produtos selecionados:</span>
                      <span className="font-medium">1</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Etapa atual:</span>
                      <span className="font-medium">{getStageDisplayName(project.status)}</span>
                    </div>
                  </div>
                </div>

                <ProjectProgress progress={getProjectProgress(project.status)} />
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