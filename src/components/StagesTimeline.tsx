import { Check, Clock } from "lucide-react";

const stages = [
  { name: "Onboarding", status: "completed", date: "10/03/2024" },
  { name: "Seleção de Produtos", status: "completed", date: "15/03/2024" },
  { name: "Naming", status: "in-progress", date: "Em andamento" },
  { name: "Identidade Visual", status: "pending", date: "Pendente" },
  { name: "Criação de Embalagens", status: "pending", date: "Pendente" },
  { name: "E-commerce", status: "pending", date: "Pendente" },
];

const StagesTimeline = () => {
  return (
    <div className="space-y-4">
      {stages.map((stage, index) => (
        <div key={stage.name} className="flex items-start gap-3">
          <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center border ${
            stage.status === "completed" 
              ? "border-primary bg-primary/10" 
              : stage.status === "in-progress"
              ? "border-primary-light bg-primary-light/10"
              : "border-muted bg-muted/10"
          }`}>
            {stage.status === "completed" ? (
              <Check className="w-3.5 h-3.5 text-primary" />
            ) : stage.status === "in-progress" ? (
              <Clock className="w-3.5 h-3.5 text-primary-light" />
            ) : (
              <div className="w-1.5 h-1.5 bg-muted rounded-full" />
            )}
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-medium text-foreground">{stage.name}</h3>
              <span className="text-xs text-muted">{stage.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StagesTimeline;