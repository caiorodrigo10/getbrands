import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { QuizNavigation } from "./QuizNavigation";
import { useTranslation } from "react-i18next";
import { Coffee, Pill, Sparkles, Dumbbell, Dog } from "lucide-react";

interface ProductCategoriesStepProps {
  selected: string[];
  onAnswer: (value: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

export function ProductCategoriesStep({
  selected,
  onAnswer,
  onNext,
  onBack,
}: ProductCategoriesStepProps) {
  const { t } = useTranslation();

  const categories = [
    { 
      value: "beverages", 
      label: t('onboarding.productCategories.beverages'),
      description: t('onboarding.productCategories.beveragesDescription'),
      icon: Coffee 
    },
    { 
      value: "supplements", 
      label: t('onboarding.productCategories.supplements'),
      description: t('onboarding.productCategories.supplementsDescription'),
      icon: Pill 
    },
    { 
      value: "beautyAndPersonalCare", 
      label: t('onboarding.productCategories.beautyAndPersonalCare'),
      description: t('onboarding.productCategories.beautyAndPersonalCareDescription'),
      icon: Sparkles 
    },
    { 
      value: "sportsNutrition", 
      label: t('onboarding.productCategories.sportsNutrition'),
      description: t('onboarding.productCategories.sportsNutritionDescription'),
      icon: Dumbbell 
    },
    { 
      value: "petCare", 
      label: t('onboarding.productCategories.petCare'),
      description: t('onboarding.productCategories.petCareDescription'),
      icon: Dog 
    },
  ];

  const handleToggleCategory = (category: string) => {
    const newSelection = selected.includes(category)
      ? selected.filter((item) => item !== category)
      : [...selected, category];
    onAnswer(newSelection);
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          {t('onboarding.productCategories.title')}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-6">
          {t('onboarding.productCategories.description')}
        </p>
      </div>

      <div className="grid gap-3">
        {categories.map((category, index) => {
          const Icon = category.icon;
          return (
            <motion.div
              key={category.value}
              initial={{ opacity: 0, y: 20 }}
              animate={{ 
                opacity: 1, 
                y: 0,
                transition: { delay: index * 0.1 }
              }}
            >
              <Label
                htmlFor={category.value}
                className={`
                  flex items-start gap-3 p-3 rounded-lg border cursor-pointer
                  transition-all duration-200
                  ${selected.includes(category.value) ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
                `}
              >
                <div className="flex-shrink-0 mt-1">
                  <Checkbox
                    id={category.value}
                    checked={selected.includes(category.value)}
                    onCheckedChange={() => handleToggleCategory(category.value)}
                  />
                </div>
                <div className="flex-grow space-y-1">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-primary" />
                    <span className="text-base font-medium">{category.label}</span>
                  </div>
                  <p className="text-xs text-gray-600">{category.description}</p>
                </div>
              </Label>
            </motion.div>
          );
        })}
      </div>

      <QuizNavigation
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={selected.length === 0}
      />
    </div>
  );
}