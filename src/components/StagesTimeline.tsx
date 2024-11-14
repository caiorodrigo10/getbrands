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
    <div className="relative space-y-3">
      {stages.map((stage, index) => (
        <div key={stage.name} className="flex items-center gap-3">
          <div className={`relative flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border ${
            stage.status === "completed" 
              ? "border-primary bg-primary text-white" 
              : stage.status === "in-progress"
              ? "border-primary-light bg-primary-light/10"
              : "border-muted bg-muted/10"
          }`}>
            {stage.status === "completed" ? (
              <Check className="w-3 h-3" />
            ) : stage.status === "in-progress" ? (
              <Clock className="w-3 h-3 text-primary-light" />
            ) : (
              <div className="w-1.5 h-1.5 bg-muted rounded-full" />
            )}
          </div>
          
          <div className="flex-grow min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className={`text-sm truncate ${
                stage.status === "completed" ? "text-foreground font-medium" :
                stage.status === "in-progress" ? "text-foreground" : "text-muted-foreground"
              }`}>
                {stage.name}
              </span>
              <span className="text-xs text-muted-foreground flex-shrink-0">{stage.date}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StagesTimeline;