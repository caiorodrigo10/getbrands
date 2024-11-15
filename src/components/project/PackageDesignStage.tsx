import { Button } from "@/components/ui/button";
import { Package } from "lucide-react";
import { PackageQuiz } from "./PackageQuiz";
import { useState } from "react";

export function PackageDesignStage() {
  const [showQuiz, setShowQuiz] = useState(false);

  if (showQuiz) {
    return <PackageQuiz />;
  }

  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
          <Package className="w-8 h-8 text-primary" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-semibold">Start Your Package Design Journey</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            Complete our package design questionnaire to help us understand your vision and create labels that perfectly align with your brand identity.
          </p>
        </div>
        <Button 
          size="lg"
          onClick={() => setShowQuiz(true)}
          className="mt-4"
        >
          Start Package Design Quiz
        </Button>
      </div>
    </div>
  );
}