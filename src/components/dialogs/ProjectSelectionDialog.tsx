import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";

interface ProjectSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  projects: any[];
  onConfirm: (projectId: string) => void;
  product: Product;
}

const loadingSteps = [
  "Recording selection...",
  "Updating project points...",
  "Sending to packaging development...",
  "Finalizing..."
];

const ProjectSelectionDialog = ({ 
  open, 
  onOpenChange,
  projects,
  onConfirm,
  product
}: ProjectSelectionDialogProps) => {
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const handleConfirm = async () => {
    if (!selectedProject) return;
    
    setIsProcessing(true);
    
    // Process through loading steps
    for (let i = 0; i < loadingSteps.length; i++) {
      setCurrentStep(i);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    try {
      await onConfirm(selectedProject);
      
      // Wait a moment to ensure the product is added
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsProcessing(false);
      onOpenChange(false);
      
      // Navigate to success page with product and project info
      navigate("/produtos/success", { 
        state: { 
          product: {
            name: product.name,
            image_url: product.image_url
          },
          project: {
            name: projects.find(p => p.id === selectedProject)?.name
          }
        }
      });
    } catch (error) {
      setIsProcessing(false);
      console.error('Error selecting product:', error);
    }
  };

  if (isProcessing) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Processing</DialogTitle>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <div className="mb-4">{loadingSteps[currentStep]}</div>
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Select Project</DialogTitle>
          <DialogDescription>
            Choose a project to add this product to.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Product Preview */}
          <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
            <img 
              src={product.image_url || "/placeholder.svg"} 
              alt={product.name}
              className="w-20 h-20 object-cover rounded-md"
            />
            <div>
              <h3 className="font-medium text-gray-900">{product.name}</h3>
              <p className="text-sm text-gray-500">Cost: 1000 points</p>
            </div>
          </div>

          <Alert className="bg-yellow-50 border-yellow-200">
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
            <AlertDescription className="text-yellow-800">
              Warning: Once you confirm this selection, 1000 points will be consumed and this action cannot be undone.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedProject === project.id
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                }`}
                onClick={() => setSelectedProject(project.id)}
              >
                <div className="font-medium">{project.name}</div>
                <div className="text-sm text-gray-500">
                  Available Points: {project.points - (project.points_used || 0)}
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-2">
            <button
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-800"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
            <button
              className={`px-4 py-2 text-sm font-medium text-white rounded-md ${
                selectedProject
                  ? "bg-primary hover:bg-primary/90"
                  : "bg-gray-300 cursor-not-allowed"
              }`}
              onClick={handleConfirm}
              disabled={!selectedProject}
            >
              Confirm Selection
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectSelectionDialog;