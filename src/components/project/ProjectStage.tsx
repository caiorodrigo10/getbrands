import { Card } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
import { StatusBadge } from "@/components/ui/status-badge";

interface ProjectStageProps {
  title: string;
  description: string;
  status: "pending" | "completed" | "in-progress";
  children: React.ReactNode;
}

export function ProjectStage({ title, description, status, children }: ProjectStageProps) {
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
            {children}
          </div>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
}