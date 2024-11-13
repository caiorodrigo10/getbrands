import { Card } from "@/components/ui/card";
import ProjectProgress from "@/components/ProjectProgress";
import StagesTimeline from "@/components/StagesTimeline";
import RecentDocuments from "@/components/RecentDocuments";
import { ChartBar, Clock, FileText } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-foreground mb-2">Projeto Marca Própria</h1>
        <p className="text-sm text-muted">Acompanhe o progresso do seu projeto</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card className="p-5 bg-secondary/50 hover:bg-secondary/60 transition-colors duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <ChartBar className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-foreground">Progresso Geral</h3>
          </div>
          <ProjectProgress progress={65} />
        </Card>

        <Card className="p-5 bg-secondary/50 hover:bg-secondary/60 transition-colors duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Clock className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-foreground">Tempo Estimado</h3>
          </div>
          <p className="text-2xl font-bold text-primary mb-1">45 dias</p>
          <p className="text-xs text-muted">Restantes</p>
        </Card>

        <Card className="p-5 bg-secondary/50 hover:bg-secondary/60 transition-colors duration-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <FileText className="w-5 h-5 text-primary" />
            </div>
            <h3 className="text-sm font-medium text-foreground">Documentos</h3>
          </div>
          <p className="text-2xl font-bold text-primary mb-1">12</p>
          <p className="text-xs text-muted">Arquivos disponíveis</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2">
          <Card className="p-5 bg-secondary/50">
            <h2 className="text-lg font-medium text-foreground mb-4">Etapas do Projeto</h2>
            <StagesTimeline />
          </Card>
        </div>
        <div>
          <Card className="p-5 bg-secondary/50">
            <h2 className="text-lg font-medium text-foreground mb-4">Documentos Recentes</h2>
            <RecentDocuments />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;