import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

interface ProjectProgressCardProps {
  project: {
    id: string;
    name: string;
    created_at: string;
    status: string;
    project_products: any[];
  };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-500/10 text-green-500";
    case "in-progress":
      return "bg-blue-500/10 text-blue-500";
    default:
      return "bg-yellow-500/10 text-yellow-500";
  }
};

const getProgressPercentage = (status: string) => {
  switch (status) {
    case "completed":
      return 100;
    case "in-progress":
      return 60;
    default:
      return 30;
  }
};

export const ProjectProgressCard = ({ project }: ProjectProgressCardProps) => {
  const navigate = useNavigate();
  const progressPercentage = getProgressPercentage(project.status);

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">{project.name}</h3>
          <Badge variant="secondary" className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Package className="w-4 h-4" />
            <span>{project.project_products?.length || 0} products</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            <span>Started {format(new Date(project.created_at), "MMM d, yyyy")}</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Project Progress</span>
            <span className="font-medium">{progressPercentage}%</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full"
        onClick={() => navigate(`/projects/v2/${project.id}`)}
      >
        View Project Details
        <ArrowRight className="ml-2 h-4 w-4" />
      </Button>
    </Card>
  );
};