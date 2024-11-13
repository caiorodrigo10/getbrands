import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

const FilterPopover = ({ 
  title, 
  options 
}: { 
  title: string;
  options: { id: string; label: string; }[];
}) => {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[120px] bg-gray-50 text-gray-800 justify-between whitespace-nowrap">
          {title}
          <ChevronDown className="h-4 w-4 text-gray-800" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-4 bg-white">
        <div className="space-y-4">
          {options.map((option) => (
            <div key={option.id} className="flex items-center space-x-2">
              <Checkbox id={option.id} />
              <label
                htmlFor={option.id}
                className="text-sm font-medium leading-none text-gray-800"
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4 pt-4 border-t">
          <Button 
            variant="outline" 
            size="sm"
            className="text-gray-800 hover:text-gray-900"
          >
            Clear
          </Button>
          <Button size="sm">Apply filter</Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

const CatalogFilters = () => {
  const categoryOptions = [
    { id: "proteins", label: "Proteins & Blends" },
    { id: "vitamins", label: "Vitamins & Supplements" },
    { id: "energy", label: "Energy & Performance" },
  ];

  const typeOptions = [
    { id: "powder", label: "Powder" },
    { id: "capsules", label: "Capsules" },
    { id: "liquid", label: "Liquid" },
  ];

  const audienceOptions = [
    { id: "adults", label: "Adults" },
    { id: "athletes", label: "Athletes" },
    { id: "seniors", label: "Seniors" },
  ];

  const purposeOptions = [
    { id: "muscle", label: "Muscle Growth" },
    { id: "energy", label: "Energy Boost" },
    { id: "health", label: "General Health" },
  ];

  const dietaryOptions = [
    { id: "vegan", label: "Vegan" },
    { id: "gluten-free", label: "Gluten Free" },
    { id: "organic", label: "Organic" },
  ];

  return (
    <div className="flex gap-2 md:gap-4 overflow-x-auto pb-2 md:pb-0">
      <FilterPopover title="Category" options={categoryOptions} />
      <FilterPopover title="Type" options={typeOptions} />
      <FilterPopover title="Audience" options={audienceOptions} />
      <FilterPopover title="Purpose" options={purposeOptions} />
      <FilterPopover title="Dietary" options={dietaryOptions} />
    </div>
  );
};

export default CatalogFilters;