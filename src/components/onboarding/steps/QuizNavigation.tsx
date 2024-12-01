import { Button } from "@/components/ui/button";
import { useLocation } from "react-router-dom";

interface QuizNavigationProps {
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  isNextDisabled?: boolean;
  showBack?: boolean;
  isOnboarding?: boolean;
}

export const QuizNavigation = ({
  onNext,
  onBack,
  nextLabel,
  backLabel,
  isNextDisabled = false,
  showBack = true,
  isOnboarding = false,
}: QuizNavigationProps) => {
  const location = useLocation();
  const isOnboardingRoute = location.pathname === "/onboarding";
  const shouldUseEnglish = isOnboardingRoute || isOnboarding;
  
  const defaultNextLabel = shouldUseEnglish ? "Next" : "Próximo";
  const defaultBackLabel = shouldUseEnglish ? "Back" : "Voltar";

  return (
    <div className="flex justify-between mt-8">
      {showBack && onBack && (
        <Button
          variant="outline"
          onClick={onBack}
          className="w-32"
        >
          {backLabel || defaultBackLabel}
        </Button>
      )}
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        className={`w-32 ${!showBack || !onBack ? 'ml-auto' : ''}`}
      >
        {nextLabel || defaultNextLabel}
      </Button>
    </div>
  );
};