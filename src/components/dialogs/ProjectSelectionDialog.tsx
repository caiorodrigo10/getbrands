import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface ProjectSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: any[];
  onConfirm: (projectId: string) => void;
}

const loadingSteps = [
  { message: "Registrando seleção...", duration: 1500 },
  { message: "Enviando para desenvolvimento de embalagens...", duration: 2000 },
  { message: "Finalizando processo...", duration: 1500 },
];

const ProjectSelectionDialog = ({ 
  open, 
  onOpenChange,
  projects,
  onConfirm
}: ProjectSelectionDialogProps) => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const processSteps = async () => {
    setIsProcessing(true);
    
    for (let i = 0; i < loadingSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, loadingSteps[i].duration));
    }

    await onConfirm(selectedProject);
    onOpenChange(false);
    setIsProcessing(false);
    setCurrentStep(0);
    
    navigate("/produtos");
    
    // Show celebration toast
    toast({
      title: "Produto selecionado com sucesso! 🎉",
      description: "O produto foi adicionado ao seu projeto.",
    });
  };

  const handleConfirm = () => {
    if (!selectedProject) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select a project to continue.",
      });
      return;
    }

    processSteps();
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
          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Warning: Once you confirm this selection, points will be consumed and this action cannot be undone.
            </AlertDescription>
          </Alert>

          <Select
            value={selectedProject}
            onValueChange={setSelectedProject}
            disabled={isProcessing}
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

          {isProcessing && (
            <div className="animate-fade-in space-y-4 py-4">
              {loadingSteps.map((step, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-2 transition-opacity duration-300 ${
                    index === currentStep ? 'opacity-100' : 'opacity-40'
                  }`}
                >
                  {index <= currentStep ? (
                    <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle2 className="h-4 w-4 text-primary animate-scale-in" />
                    </div>
                  ) : (
                    <div className="h-6 w-6 rounded-full border border-gray-200" />
                  )}
                  <span className="text-sm text-gray-600">{step.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onOpenChange(false)}
            disabled={isProcessing}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleConfirm}
            disabled={isProcessing}
          >
            {isProcessing ? "Processing..." : "Confirm Selection"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSelectionDialog;