import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

interface ProductCategoriesStepProps {
  selected: string[];
  onAnswer: (categories: string[]) => void;
  onNext: () => void;
}

const categories = [
  {
    id: "coffee",
    label: "Coffee & Beverages",
    image: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
  },
  {
    id: "supplements",
    label: "Supplements & Vitamins",
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
  },
  {
    id: "cosmetics",
    label: "Cosmetics & Personal Care",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07"
  },
  {
    id: "sports",
    label: "Sports Nutrition & Proteins",
    image: "https://images.unsplash.com/photo-1535268647677-300dbf3d78d1"
  },
  {
    id: "natural",
    label: "Natural Products & Extracts",
    image: "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07"
  },
  {
    id: "pet",
    label: "Pet Products",
    image: "https://images.unsplash.com/photo-1582562124811-c09040d0a901"
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
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Which product categories are you interested in creating?
        </h2>
        <p className="text-gray-600">Select all that apply</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.map((category) => (
          <motion.div
            key={category.id}
            className={`
              relative rounded-2xl overflow-hidden cursor-pointer
              transition-all duration-200 transform hover:scale-105
              ${selected.includes(category.id) ? 'ring-4 ring-primary' : 'ring-1 ring-gray-200'}
            `}
            onClick={() => toggleCategory(category.id)}
            whileHover={{ y: -5 }}
          >
            <div className="aspect-video relative">
              <img
                src={category.image}
                alt={category.label}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white text-xl font-bold">
                  {category.label}
                </span>
              </div>
              {selected.includes(category.id) && (
                <div className="absolute top-4 right-4 bg-primary rounded-full p-1">
                  <Check className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="flex justify-end">
        <Button
          onClick={onNext}
          disabled={selected.length === 0}
          size="lg"
          className="mt-4"
        >
          Next
        </Button>
      </div>
    </div>
  );
};