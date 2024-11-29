import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizNavigation } from "./QuizNavigation";
import { useTranslation } from "react-i18next";
import { Rocket, Palette, Crown } from "lucide-react";

interface BrandStatusStepProps {
  selected: string;
  onAnswer: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export function BrandStatusStep({ selected, onAnswer, onNext, onBack }: BrandStatusStepProps) {
  const { t } = useTranslation();

  const options = [
    { 
      value: "no_brand", 
      label: t('onboarding.brandStatus.options.noBrand'),
      description: t('onboarding.brandStatus.options.noBrandDescription'),
      icon: Rocket
    },
    { 
      value: "partial_brand", 
      label: t('onboarding.brandStatus.options.partialBrand'),
      description: t('onboarding.brandStatus.options.partialBrandDescription'),
      icon: Palette
    },
    { 
      value: "complete_brand", 
      label: t('onboarding.brandStatus.options.completeBrand'),
      description: t('onboarding.brandStatus.options.completeBrandDescription'),
      icon: Crown
    }
  ];

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          {t('onboarding.brandStatus.title')}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-8">
          {t('onboarding.brandStatus.description')}
        </p>
      </div>

      <RadioGroup
        value={selected}
        onValueChange={onAnswer}
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
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={!selected}
      />
    </div>
  );
}