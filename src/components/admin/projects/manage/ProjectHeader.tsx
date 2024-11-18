import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const ProjectHeader = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex items-center justify-between mb-6">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => navigate('/admin/projects')}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Projects
      </Button>
    </div>
  );
};