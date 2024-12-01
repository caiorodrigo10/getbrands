import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <div className="text-center space-y-6">
      <h3 className="text-2xl font-semibold">Welcome to Your Package Design Quiz</h3>
      <p className="text-muted-foreground max-w-2xl mx-auto">
        This quiz will help us understand how you'd like your brand identity to be
        represented in your product labels. We'll guide you through several questions
        about your preferences to ensure your labels perfectly align with your brand.
      </p>
      <Button onClick={onNext} className="w-full md:w-auto">
        Start Quiz
      </Button>
    </div>
  );
};