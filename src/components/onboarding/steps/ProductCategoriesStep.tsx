import { motion } from "framer-motion";
import { Coffee, Pill, Sparkles, Dumbbell, Dog } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductCategoriesStepProps {
  selected: string[];
  onAnswer: (categories: string[]) => void;
  onNext: () => void;
}

const categories = [
  {
    id: "beverages",
    label: "Beverages",
    description: "Premium coffee, instant coffee, and RTD beverages.",
    icon: Coffee,
  },
  {
    id: "supplements",
    label: "Supplements",
    description: "Vitamins, minerals, and specialty capsules.",
    icon: Pill,
  },
  {
    id: "beauty",
    label: "Beauty & Personal Care",
    description: "Skincare products, hair care treatments, and body lotions.",
    icon: Sparkles,
  },
  {
    id: "sports",
    label: "Sports Nutrition",
    description: "Protein powders, pre-workouts, and meal replacement shakes.",
    icon: Dumbbell,
  },
  {
    id: "pet",
    label: "Pet Care",
    description: "Pet supplements, vitamins, and wellness products.",
    icon: Dog,
  }
];

export const ProductCategoriesStep = ({ 
  selected, 
  onAnswer,
  onNext 
}: ProductCategoriesStepProps) => {
  const toggleCategory = (categoryId: string) => {
    const newSelected = selected.includes(categoryId)
      ? selected.filter(id => id !== categoryId)
      : [...selected, categoryId];
    onAnswer(newSelected);
  };

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-2">
          Which product categories are you interested in creating?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">Select all that apply</p>
      </div>

      <div className="space-y-2">
        {categories.map((category) => {
          const isSelected = selected.includes(category.id);
          const Icon = category.icon;
          
          return (
            <motion.div
              key={category.id}
              className={`
                relative rounded-lg border py-3.5 sm:py-4 px-4 cursor-pointer
                transition-all duration-200
                ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
              `}
              onClick={() => toggleCategory(category.id)}
              whileHover={{ y: -2 }}
            >
              <div className="flex flex-col">
                <div className="flex items-center gap-3">
                  <Checkbox 
                    checked={isSelected}
                    className="h-4 w-4"
                    onCheckedChange={() => toggleCategory(category.id)}
                  />
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
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};