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
        <div key={stage.name} className="flex items-start gap-4">
          <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center border-2">
            {stage.status === "completed" ? (
              <Check className="w-4 h-4 text-primary" />
            ) : stage.status === "in-progress" ? (
              <Clock className="w-4 h-4 text-primary-light" />
            ) : (
              <div className="w-2 h-2 bg-gray-300 rounded-full" />
            )}
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">{stage.name}</h3>
              <span className="text-sm text-gray-500">{stage.date}</span>
            </div>
            <div className="mt-1">
              <div
                className={`h-1 rounded-full ${
                  stage.status === "completed"
                    ? "bg-primary"
                    : stage.status === "in-progress"
                    ? "bg-primary-light"
                    : "bg-gray-200"
                }`}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StagesTimeline;