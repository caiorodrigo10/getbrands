import { motion } from "framer-motion";
import { Coffee, Pill, Sparkles, Dumbbell, Leaf, Dog } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductCategoriesStepProps {
  selected: string[];
  onAnswer: (categories: string[]) => void;
  onNext: () => void;
}

const categories = [
  {
    id: "coffee",
    label: "Coffee & Beverages",
    icon: Coffee,
  },
  {
    id: "supplements",
    label: "Supplements & Vitamins",
    icon: Pill,
  },
  {
    id: "cosmetics",
    label: "Cosmetics & Personal Care",
    icon: Sparkles,
  },
  {
    id: "sports",
    label: "Sports Nutrition & Proteins",
    icon: Dumbbell,
  },
  {
    id: "natural",
    label: "Natural Products & Extracts",
    icon: Leaf,
  },
  {
    id: "pet",
    label: "Pet Products",
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
    <div className="space-y-8 max-w-xl mx-auto">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
          Which product categories are you interested in creating?
        </h2>
        <p className="text-gray-600">Select all that apply</p>
      </div>

      <div className="space-y-3">
        {categories.map((category) => {
          const isSelected = selected.includes(category.id);
          const Icon = category.icon;
          
          return (
            <motion.div
              key={category.id}
              className={`
                relative rounded-lg border p-4 cursor-pointer
                transition-all duration-200
                ${isSelected ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
              `}
              onClick={() => toggleCategory(category.id)}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-4">
                <Checkbox 
                  checked={isSelected}
                  className="h-5 w-5"
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <div className="p-2 rounded-full bg-primary/10">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
                <span className="text-base sm:text-lg font-medium text-gray-900">
                  {category.label}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};