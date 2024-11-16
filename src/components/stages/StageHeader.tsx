import { Check, Clock } from "lucide-react";

interface StageHeaderProps {
  name: string;
  status: "completed" | "in-progress" | "pending";
}

export const StageHeader = ({ name, status }: StageHeaderProps) => {
  return (
    <div className="flex items-center gap-3">
      <div className={`relative flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border ${
        status === "completed" 
          ? "border-primary bg-primary text-white" 
          : status === "in-progress"
          ? "border-primary-light bg-primary-light/10"
          : "border-muted bg-muted/10"
      }`}>
        {status === "completed" ? (
          <Check className="w-3 h-3" />
        ) : status === "in-progress" ? (
          <Clock className="w-3 h-3 text-primary-light" />
        ) : (
          <div className="w-1.5 h-1.5 bg-muted rounded-full" />
        )}
      </div>
      
      <div className="flex-grow min-w-0">
        <span className={`text-sm font-medium ${
          status === "completed" ? "text-foreground" :
          status === "in-progress" ? "text-foreground" : "text-muted-foreground"
        }`}>
          {name}
        </span>
      </div>
    </div>
  );
};