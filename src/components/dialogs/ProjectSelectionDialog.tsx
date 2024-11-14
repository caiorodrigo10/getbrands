import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProjectSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: any[];
  onConfirm: (projectId: string) => void;
}

const ProjectSelectionDialog = ({ 
  open, 
  onOpenChange,
  projects,
  onConfirm
}: ProjectSelectionDialogProps) => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const { toast } = useToast();

  const handleConfirm = () => {
    if (!selectedProject) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a project to continue.",
      });
      return;
    }

    onConfirm(selectedProject);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Select Project</DialogTitle>
          <DialogDescription>
            Choose which project you want to add this product to. 
            This action is final as the product will go into production.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="warning" className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Warning: Once you confirm this selection, points will be consumed and this action cannot be undone.
            </AlertDescription>
          </Alert>

          <Select
            value={selectedProject}
            onValueChange={setSelectedProject}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {projects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  {project.name} ({(project.points - project.points_used)} pts)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleConfirm}>
            Confirm Selection
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSelectionDialog;