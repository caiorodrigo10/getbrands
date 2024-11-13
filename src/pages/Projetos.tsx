import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, ArrowRight, Clock } from "lucide-react";
import ProjectProgress from "@/components/ProjectProgress";
import { useToast } from "@/components/ui/use-toast";

const Projetos = () => {
  const { toast } = useToast();
  const projectStatus = "Em Andamento";
  const progress = 65;

  const handleViewProject = () => {
    toast({
      title: "Redirecionando para detalhes do projeto",
      description: "Carregando informações detalhadas...",
    });
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary-light mb-2">Projeto Ativo</h1>
        <p className="text-gray-400">Acompanhe o progresso do seu projeto</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-gray-900 border-gray-800 p-6">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-white mb-2">Marca Própria - Beauty Care</h2>
              <Badge 
                variant="default" 
                className="bg-primary-light text-white"
              >
                {projectStatus}
              </Badge>
            </div>
            <Bell className="text-primary-light w-6 h-6" />
          </div>

          <div className="mb-6">
            <ProjectProgress progress={progress} />
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Data de Início</p>
              <p className="font-semibold">10 Mar 2024</p>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg">
              <p className="text-gray-400 text-sm mb-1">Previsão de Conclusão</p>
              <p className="font-semibold">25 Mai 2024</p>
            </div>
          </div>

          <Button 
            onClick={handleViewProject}
            className="w-full bg-primary hover:bg-primary-light text-white"
          >
            Ver Projeto Completo
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Card>

        <div className="space-y-6">
          <Card className="bg-gray-900 border-gray-800 p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Últimas Atualizações</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-light mt-2" />
                <div>
                  <p className="font-medium text-white">Onboarding Concluído</p>
                  <p className="text-sm text-gray-400">20 Mar 2024</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-primary-light mt-2" />
                <div>
                  <p className="font-medium text-white">Seleção de Produtos Iniciada</p>
                  <p className="text-sm text-gray-400">18 Mar 2024</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="bg-gray-900 border-gray-800 p-6">
            <h3 className="text-lg font-semibold mb-4 text-white">Próximos Passos</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Clock className="text-primary-light w-5 h-5" />
                <div>
                  <p className="font-medium text-white">Naming</p>
                  <p className="text-sm text-gray-400">Início previsto: 01 Abr 2024</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="text-primary-light w-5 h-5" />
                <div>
                  <p className="font-medium text-white">Identidade Visual</p>
                  <p className="text-sm text-gray-400">Início previsto: 15 Abr 2024</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Projetos;