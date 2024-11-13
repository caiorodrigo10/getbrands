import { Card } from "@/components/ui/card";
import ProjectProgress from "@/components/ProjectProgress";
import StagesTimeline from "@/components/StagesTimeline";
import RecentDocuments from "@/components/RecentDocuments";
import { ChartBar, Clock, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-white py-8">
      <div className="container mx-auto px-4">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-primary mb-2">Projeto Marca Própria</h1>
          <p className="text-gray-600">Acompanhe o progresso do seu projeto</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <ChartBar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900">Progresso Geral</h3>
            </div>
            <ProjectProgress progress={65} />
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900">Tempo Estimado</h3>
            </div>
            <p className="text-3xl font-bold text-primary">45 dias</p>
            <p className="text-sm text-gray-500">Restantes</p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-shadow duration-200 border border-gray-100">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-gray-900">Documentos</h3>
            </div>
            <p className="text-3xl font-bold text-primary">12</p>
            <p className="text-sm text-gray-500">Arquivos disponíveis</p>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="p-6 border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Etapas do Projeto</h2>
              <StagesTimeline />
            </Card>
          </div>
          <div>
            <Card className="p-6 border border-gray-100">
              <h2 className="text-xl font-bold mb-6 text-gray-900">Documentos Recentes</h2>
              <RecentDocuments />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;