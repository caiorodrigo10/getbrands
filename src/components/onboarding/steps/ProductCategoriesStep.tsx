import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { QuizNavigation } from "./QuizNavigation";
import { useTranslation } from "react-i18next";

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
    { value: "cosmetics", label: t('onboarding.productCategories.categories.cosmetics') },
    { value: "coffee", label: t('onboarding.productCategories.categories.coffee') },
    { value: "supplements", label: t('onboarding.productCategories.categories.supplements') },
    { value: "petProducts", label: t('onboarding.productCategories.categories.petProducts') },
  ];

  const handleToggleCategory = (category: string) => {
    const newSelection = selected.includes(category)
      ? selected.filter((item) => item !== category)
      : [...selected, category];
    onAnswer(newSelection);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">
          {t('onboarding.productCategories.title')}
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          {t('onboarding.productCategories.description')}
        </p>
      </div>

      <div className="grid gap-4">
        {categories.map((category, index) => (
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
                flex items-center space-x-3 p-4 sm:p-6 rounded-xl border-2 cursor-pointer
                transition-all duration-200
                ${selected.includes(category.value) ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
              `}
            >
              <Checkbox
                id={category.value}
                checked={selected.includes(category.value)}
                onCheckedChange={() => handleToggleCategory(category.value)}
              />
              <span className="text-base sm:text-xl">{category.label}</span>
            </Label>
          </motion.div>
        ))}
      </div>

      <QuizNavigation
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={selected.length === 0}
        nextLabel={t('onboarding.navigation.next')}
        backLabel={t('onboarding.navigation.back')}
      />
    </div>
  );
}