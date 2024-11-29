import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { QuizNavigation } from "./QuizNavigation";
import { useTranslation } from "react-i18next";
import { Sparkles, Coffee, Dumbbell, Dog } from "lucide-react";

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
      value: "cosmetics", 
      label: t('onboarding.productCategories.cosmetics'),
      description: t('onboarding.productCategories.cosmeticsDescription'),
      icon: Sparkles 
    },
    { 
      value: "coffee", 
      label: t('onboarding.productCategories.coffee'),
      description: t('onboarding.productCategories.coffeeDescription'),
      icon: Coffee 
    },
    { 
      value: "supplements", 
      label: t('onboarding.productCategories.supplements'),
      description: t('onboarding.productCategories.supplementsDescription'),
      icon: Dumbbell 
    },
    { 
      value: "petProducts", 
      label: t('onboarding.productCategories.petProducts'),
      description: t('onboarding.productCategories.petProductsDescription'),
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
    <div className="w-full max-w-3xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          {t('onboarding.productCategories.title')}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-8">
          {t('onboarding.productCategories.description')}
        </p>
      </div>

      <div className="grid gap-4">
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
                  flex items-start gap-4 p-6 rounded-xl border-2 cursor-pointer
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
                <div className="flex-grow space-y-2">
                  <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-primary" />
                    <span className="text-lg font-medium">{category.label}</span>
                  </div>
                  <p className="text-sm text-gray-600">{category.description}</p>
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