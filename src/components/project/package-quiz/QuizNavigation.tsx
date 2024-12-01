import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface QuizNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  onSave: () => void;
  onSubmit: () => void;
}

export const QuizNavigation = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  onSave,
  onSubmit,
}: QuizNavigationProps) => {
  return (
    <div className="flex justify-between">
      {currentStep > 1 && (
        <Button variant="outline" onClick={onBack}>
          <ChevronLeft className="w-4 h-4 mr-2" />
          Back
        </Button>
      )}
      <div className="flex gap-2">
        <Button variant="outline" onClick={onSave}>
          Save Progress
        </Button>
        {currentStep < totalSteps && (
          <Button onClick={onNext}>
            Next
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        )}
        {currentStep === totalSteps && (
          <Button onClick={onSubmit}>
            Submit
          </Button>
        )}
      </div>
    </div>
  );
};