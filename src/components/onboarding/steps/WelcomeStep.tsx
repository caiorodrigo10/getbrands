import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  const { t } = useTranslation();

  return (
    <div className="text-center space-y-6 max-w-lg mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
          {t('onboarding.welcome.title')}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 max-w-md mx-auto">
          {t('onboarding.welcome.description')}
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Button
          onClick={onNext}
          className="w-full sm:w-auto px-8"
        >
          {t('onboarding.welcome.startButton')}
        </Button>
      </motion.div>
    </div>
  );
};