import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";
import { PackageQuiz } from "./PackageQuiz";
import { useParams } from "react-router-dom";

interface ProjectStageProps {
  title: string;
  description: string;
  status: "pending" | "completed" | "in-progress";
  children: React.ReactNode;
  type?: "default" | "package-quiz";
}

export function ProjectStage({ 
  title, 
  description, 
  status, 
  children, 
  type = "default" 
}: ProjectStageProps) {
  const { id: projectId } = useParams();

  if (type === "package-quiz" && !projectId) {
    return null;
  }

  return (
    <Collapsible>
      <Card>
        <CollapsibleTrigger className="w-full">
          <div className="flex items-center justify-between p-6">
            <div className="space-y-1 text-left">
              <div className="flex items-center gap-3">
                <h3 className="text-xl font-semibold">{title}</h3>
                <StatusBadge status={status} />
              </div>
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            </div>
            <ChevronDown className="h-5 w-5 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </div>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="border-t px-6 pb-6 pt-4">
            {type === "package-quiz" && projectId ? (
              <PackageQuiz projectId={projectId} />
            ) : (
              children
            )}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}