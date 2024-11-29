import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface QuizNavigationProps {
  onNext: () => void;
  onBack?: () => void;
  nextLabel?: string;
  backLabel?: string;
  isNextDisabled?: boolean;
  showBack?: boolean;
}

export const QuizNavigation = ({
  onNext,
  onBack,
  nextLabel,
  backLabel,
  isNextDisabled = false,
  showBack = true,
}: QuizNavigationProps) => {
  const { t } = useTranslation();

  return (
    <div className="flex justify-between mt-8">
      {showBack && onBack && (
        <Button
          variant="outline"
          onClick={onBack}
          className="w-32"
        >
          {backLabel || t('onboarding.navigation.back')}
        </Button>
      )}
      <Button
        onClick={onNext}
        disabled={isNextDisabled}
        className={`w-32 ${!showBack || !onBack ? 'ml-auto' : ''}`}
      >
        {nextLabel || t('onboarding.navigation.next')}
      </Button>
    </div>
  );
};