import { Card } from "@/components/ui/card";
import ProjectProgress from "@/components/ProjectProgress";
import StagesTimeline from "@/components/StagesTimeline";
import RecentDocuments from "@/components/RecentDocuments";
import { ChartBar, Clock, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Projeto Marca Própria</h1>
          <p className="text-gray-600">Acompanhe o progresso do seu projeto</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 card-hover">
            <div className="flex items-center gap-4 mb-4">
              <ChartBar className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">Progresso Geral</h3>
            </div>
            <ProjectProgress progress={65} />
          </Card>

          <Card className="p-6 card-hover">
            <div className="flex items-center gap-4 mb-4">
              <Clock className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">Tempo Estimado</h3>
            </div>
            <p className="text-2xl font-bold text-primary">45 dias</p>
            <p className="text-sm text-gray-500">Restantes</p>
          </Card>

          <Card className="p-6 card-hover">
            <div className="flex items-center gap-4 mb-4">
              <FileText className="w-6 h-6 text-primary" />
              <h3 className="font-semibold">Documentos</h3>
            </div>
            <p className="text-2xl font-bold text-primary">12</p>
            <p className="text-sm text-gray-500">Arquivos disponíveis</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Etapas do Projeto</h2>
              <StagesTimeline />
            </Card>
          </div>
          <div>
            <Card className="p-6">
              <h2 className="text-xl font-bold mb-6">Documentos Recentes</h2>
              <RecentDocuments />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;