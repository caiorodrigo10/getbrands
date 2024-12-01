import { useState } from "react";
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
import { trackProductFilter } from "@/lib/analytics/events/products";

const FilterPopover = ({ 
  title, 
  options,
  onFilterApply 
}: { 
  title: string;
  options: { id: string; label: string; }[];
  onFilterApply: (filters: string[]) => void;
}) => {
  const [selectedFilters, setSelectedFilters] = useState<string[]>([]);

  const handleApplyFilter = () => {
    onFilterApply(selectedFilters);
    trackProductFilter({ [title.toLowerCase()]: selectedFilters }, 0); // resultsCount será atualizado depois
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[90px] px-2 py-1 bg-gray-50 text-gray-800 justify-between whitespace-nowrap text-sm">
          {title}
          <ChevronDown className="h-3 w-3 text-gray-800" />
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

  const handleFilterApply = (filterType: string, selectedValues: string[]) => {
    // Aqui você pode implementar a lógica de filtragem
    // e obter o número de resultados para passar para o tracking
    const resultsCount = 0; // Substitua pelo número real de resultados
    trackProductFilter({ [filterType]: selectedValues }, resultsCount);
  };

  return (
    <div className="flex gap-1 md:gap-2 overflow-x-auto pb-2 md:pb-0">
      <FilterPopover 
        title="Category" 
        options={categoryOptions} 
        onFilterApply={(filters) => handleFilterApply("category", filters)}
      />
      <FilterPopover 
        title="Type" 
        options={typeOptions} 
        onFilterApply={(filters) => handleFilterApply("type", filters)}
      />
      <FilterPopover 
        title="Audience" 
        options={audienceOptions} 
        onFilterApply={(filters) => handleFilterApply("audience", filters)}
      />
      <FilterPopover 
        title="Purpose" 
        options={purposeOptions} 
        onFilterApply={(filters) => handleFilterApply("purpose", filters)}
      />
      <FilterPopover 
        title="Dietary" 
        options={dietaryOptions} 
        onFilterApply={(filters) => handleFilterApply("dietary", filters)}
      />
    </div>
  );
};

export default CatalogFilters;
