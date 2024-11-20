import { motion } from "framer-motion";
import { Checkbox } from "@/components/ui/checkbox";
import { Coffee, Palette, Pill, Dog } from "lucide-react";

interface ProductCategoriesStepProps {
  selected: string[];
  onAnswer: (categories: string[]) => void;
  onNext: () => void;
}

const categories = [
  {
    id: "cosmetics",
    label: "Cosmetics",
    icon: Palette,
  },
  {
    id: "coffee",
    label: "Coffee",
    icon: Coffee,
  },
  {
    id: "supplements",
    label: "Supplements",
    icon: Pill,
  },
  {
    id: "pet_products",
    label: "Pet Products",
    icon: Dog,
  },
];

export const ProductCategoriesStep = ({
  selected,
  onAnswer,
}: ProductCategoriesStepProps) => {
  const toggleCategory = (categoryId: string) => {
    let newSelected;
    if (selected.includes(categoryId)) {
      newSelected = selected.filter((id) => id !== categoryId);
    } else {
      newSelected = [...selected, categoryId];
    }
    onAnswer(newSelected);
  };

  return (
    <div className="space-y-8">
      {/* Logo */}
      <div className="flex justify-center mb-8">
        <img
          src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
          alt="GetBrands Logo"
          className="h-12 w-auto"
        />
      </div>

      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Which product categories are you interested in creating?
        </h2>
        <p className="text-lg text-gray-600">
          Select all that apply. You can always change this later.
        </p>
      </div>

      <div className="grid gap-4">
        {categories.map((category) => {
          const Icon = category.icon;
          const isSelected = selected.includes(category.id);

          return (
            <motion.div
              key={category.id}
              className={`
                p-4 rounded-lg border-2 cursor-pointer
                ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-gray-200 hover:border-primary/50"
                }
              `}
              onClick={() => toggleCategory(category.id)}
              whileHover={{ y: -2 }}
            >
              <div className="flex items-center gap-6">
                <Checkbox 
                  checked={isSelected}
                  className="h-5 w-5"
                  onCheckedChange={() => toggleCategory(category.id)}
                />
                <div className="p-2 rounded-full bg-primary/10">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <span className="text-lg font-medium text-gray-900">
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