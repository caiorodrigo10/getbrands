import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizNavigation } from "./QuizNavigation";
import { useTranslation } from "react-i18next";
import { Users, Rocket, LineChart } from "lucide-react";

interface ProfileTypeStepProps {
  selected: string;
  onAnswer: (type: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const ProfileTypeStep = ({ 
  selected, 
  onAnswer,
  onNext,
  onBack
}: ProfileTypeStepProps) => {
  const { t } = useTranslation();

  const profileTypes = [
    { 
      id: "creator", 
      label: t('onboarding.profileType.types.creator'),
      description: t('onboarding.profileType.types.creatorDescription'),
      icon: Users
    },
    { 
      id: "entrepreneur", 
      label: t('onboarding.profileType.types.entrepreneur'),
      description: t('onboarding.profileType.types.entrepreneurDescription'),
      icon: Rocket
    },
    { 
      id: "marketer", 
      label: t('onboarding.profileType.types.marketer'),
      description: t('onboarding.profileType.types.marketerDescription'),
      icon: LineChart
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          {t('onboarding.profileType.title')}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-8">
          {t('onboarding.profileType.description')}
        </p>
      </div>

      <RadioGroup
        value={selected}
        onValueChange={onAnswer}
        className="grid gap-4"
      >
        {profileTypes.map((type, index) => {
          const Icon = type.icon;
          return (
            <motion.div
              key={type.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: index * 0.1 }
              }}
            >
              <Label
                htmlFor={type.id}
                className={`
                  flex items-start gap-4 p-6 rounded-xl border-2 cursor-pointer
                  transition-all duration-200
                  ${selected === type.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
                `}
              >
                <div className="flex-shrink-0 mt-1">
                  <RadioGroupItem value={type.id} id={type.id} />
                </div>
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-lg font-medium">{type.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{type.description}</p>
                </div>
              </Label>
            </motion.div>
          );
        })}
      </RadioGroup>

      <QuizNavigation
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={!selected}
      />
    </div>
  );
};