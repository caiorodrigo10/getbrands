import { Checkbox } from "@/components/ui/checkbox";

interface CategoryCheckboxProps {
  category: string;
  isSelected: boolean;
  onToggle: (category: string) => void;
}

export const CategoryCheckbox = ({ category, isSelected, onToggle }: CategoryCheckboxProps) => {
  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        id={category}
        checked={isSelected}
        onCheckedChange={() => onToggle(category)}
      />
      <label
        htmlFor={category}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {category}
      </label>
    </div>
  );
};