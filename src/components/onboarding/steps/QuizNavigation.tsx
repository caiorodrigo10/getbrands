import { Button } from "@/components/ui/button";

interface QuizNavigationProps {
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  isNextDisabled?: boolean;
  showBack?: boolean;
}

export const QuizNavigation = ({
  onNext,
  onBack,
  nextLabel = "Next",
  isNextDisabled = false,
  showBack = true,
}: QuizNavigationProps) => {
  return (
    <div className="flex justify-between mt-8">
      {showBack && onBack && (
        <Button
          variant="outline"
          onClick={onBack}
          className="w-32"
        >
          Back
        </Button>
      )}
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        className={`w-32 ${!showBack || !onBack ? 'ml-auto' : ''}`}
      >
        {nextLabel}
      </Button>
    </div>
  );
};