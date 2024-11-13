import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bell, ArrowRight, Clock } from "lucide-react";
import ProjectProgress from "@/components/ProjectProgress";
import { useToast } from "@/components/ui/use-toast";

const ProjectCard = () => {
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
    <Card className="bg-white border-gray-100 p-6 hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Marca Própria - Beauty Care
          </h2>
          <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20">
            {projectStatus}
          </Badge>
        </div>
        <Bell className="text-primary w-6 h-6" />
      </div>

      <div className="mb-6">
        <ProjectProgress progress={progress} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm mb-1">Data de Início</p>
          <p className="font-semibold text-gray-900">10 Mar 2024</p>
        </div>
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-sm mb-1">Previsão de Conclusão</p>
          <p className="font-semibold text-gray-900">25 Mai 2024</p>
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
  );
};

const UpdateCard = ({ title, date }: { title: string; date: string }) => (
  <div className="flex items-start gap-3">
    <div className="w-2 h-2 rounded-full bg-primary mt-2" />
    <div>
      <p className="font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
  </div>
);

const NextStepCard = ({ title, date }: { title: string; date: string }) => (
  <div className="flex items-center gap-3">
    <Clock className="text-primary w-5 h-5" />
    <div>
      <p className="font-medium text-gray-900">{title}</p>
      <p className="text-sm text-gray-500">{date}</p>
    </div>
  </div>
);

const Projetos = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Projeto Ativo</h1>
        <p className="text-gray-600">Acompanhe o progresso do seu projeto</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ProjectCard />
        </div>

        <div className="space-y-6">
          <Card className="bg-white border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Últimas Atualizações
            </h3>
            <div className="space-y-4">
              <UpdateCard 
                title="Onboarding Concluído"
                date="20 Mar 2024"
              />
              <UpdateCard 
                title="Seleção de Produtos Iniciada"
                date="18 Mar 2024"
              />
            </div>
          </Card>

          <Card className="bg-white border-gray-100 p-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">
              Próximos Passos
            </h3>
            <div className="space-y-4">
              <NextStepCard 
                title="Naming"
                date="Início previsto: 01 Abr 2024"
              />
              <NextStepCard 
                title="Identidade Visual"
                date="Início previsto: 15 Abr 2024"
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Projetos;