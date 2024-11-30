import { motion } from "framer-motion";
import { Coffee, Pill, Sparkles, Dumbbell, Dog } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizNavigation } from "@/components/onboarding/steps/QuizNavigation";

interface ProductCategoriesStepProps {
  selected: string[];
  onAnswer: (categories: string[]) => void;
  onNext: () => void;
  onBack: () => void;
}

const categories = [
  {
    id: "beverages",
    label: "Bebidas",
    description: "Café premium, café instantâneo e bebidas prontas para beber.",
    icon: Coffee,
  },
  {
    id: "supplements",
    label: "Suplementos",
    description: "Vitaminas, minerais e cápsulas especiais.",
    icon: Pill,
  },
  {
    id: "beauty",
    label: "Beleza & Cuidados Pessoais",
    description: "Produtos para pele, tratamentos capilares e loções corporais.",
    icon: Sparkles,
  },
  {
    id: "sports",
    label: "Nutrição Esportiva",
    description: "Whey protein, pré-treinos e shakes substitutos de refeição.",
    icon: Dumbbell,
  },
  {
    id: "pet",
    label: "Cuidados com Pets",
    description: "Suplementos para pets, vitaminas e produtos de bem-estar.",
    icon: Dog,
  }
];

export const ProductCategoriesStepPT = ({ 
  selected, 
  onAnswer,
  onNext,
  onBack
}: ProductCategoriesStepProps) => {
  const handleSelection = (categoryId: string) => {
    onAnswer([categoryId]);
    onNext();
  };

  return (
    <div className="w-full max-w-3xl mx-auto space-y-6 px-6 sm:px-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">
          Qual categoria de produto você tem interesse em criar?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">Selecione uma opção</p>
      </div>

      <RadioGroup
        value={selected[0]}
        onValueChange={handleSelection}
        className="space-y-2"
      >
        {categories.map((category) => {
          const Icon = category.icon;
          
          return (
            <motion.div
              key={category.id}
              className={`
                relative rounded-lg border py-3.5 sm:py-4 px-4 cursor-pointer
                transition-all duration-200
                ${selected[0] === category.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
              `}
              whileHover={{ y: -2 }}
            >
              <Label
                htmlFor={category.id}
                className="flex flex-col cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value={category.id} id={category.id} />
                  <div className="p-1.5 rounded-full bg-primary/10">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <span className="text-sm sm:text-base font-medium text-gray-900">
                    {category.label}
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-gray-500 mt-1 ml-10">
                  {category.description}
                </p>
              </Label>
            </motion.div>
          );
        })}
      </RadioGroup>

      <QuizNavigation
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={!selected.length}
        showBack={true}
      />
    </div>
  );
};