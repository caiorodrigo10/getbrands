import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizNavigation } from "./QuizNavigation";
import { useTranslation } from "react-i18next";
import { Flame, Clock, Calendar } from "lucide-react";

interface LaunchUrgencyStepProps {
  selected: string;
  onAnswer: (value: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

export function LaunchUrgencyStep({ 
  selected, 
  onAnswer, 
  onComplete, 
  onBack 
}: LaunchUrgencyStepProps) {
  const { t } = useTranslation();

  const options = [
    { 
      value: "immediate", 
      label: t('onboarding.launchUrgency.options.immediate'),
      description: t('onboarding.launchUrgency.options.immediateDescription'),
      icon: Flame
    },
    { 
      value: "3_months", 
      label: t('onboarding.launchUrgency.options.soon'),
      description: t('onboarding.launchUrgency.options.soonDescription'),
      icon: Clock
    },
    { 
      value: "6_months", 
      label: t('onboarding.launchUrgency.options.planning'),
      description: t('onboarding.launchUrgency.options.planningDescription'),
      icon: Calendar
    }
  ];

  const handleSelectionChange = (value: string) => {
    onAnswer(value);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          {t('onboarding.launchUrgency.title')}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-8">
          {t('onboarding.launchUrgency.description')}
        </p>
      </div>

      <RadioGroup
        value={selected}
        onValueChange={handleSelectionChange}
        className="grid gap-4"
      >
        {options.map((option, index) => {
          const Icon = option.icon;
          return (
            <motion.div
              key={option.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: index * 0.1 }
              }}
            >
              <Label
                htmlFor={option.value}
                className={`
                  flex items-start gap-4 p-6 rounded-xl border-2 cursor-pointer
                  transition-all duration-200
                  ${selected === option.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
                `}
              >
                <div className="flex-shrink-0 mt-1">
                  <RadioGroupItem value={option.value} id={option.value} />
                </div>
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-lg font-medium">{option.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
              </Label>
            </motion.div>
          );
        })}
      </RadioGroup>

      <QuizNavigation
        onNext={onComplete}
        onBack={onBack}
        isNextDisabled={!selected}
        nextLabel={t('onboarding.navigation.complete')}
      />
    </div>
  );
}