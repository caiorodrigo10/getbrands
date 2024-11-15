import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjectProgress from "@/components/ProjectProgress";

interface ProjectsOverviewProps {
  projects: any[];
}

const ProjectsOverview = ({ projects }: ProjectsOverviewProps) => {
  const navigate = useNavigate();

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Projects Overview</h2>
        <Button variant="ghost" onClick={() => navigate("/projects")}>
          View All <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-6">
        {projects?.map((project) => (
          <div key={project.id} className="space-y-2">
            <h3 className="font-medium">{project.name}</h3>
            <ProjectProgress progress={30} />
          </div>
        ))}
      </div>
    </Card>
  );
};

export default ProjectsOverview;