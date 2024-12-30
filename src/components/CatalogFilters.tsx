import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDown } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CategoryCheckbox } from "./catalog/filters/CategoryCheckbox";
import { FilterActions } from "./catalog/filters/FilterActions";
import { useCategoryFilter } from "./catalog/filters/useCategoryFilter";

const CatalogFilters = () => {
  const {
    selectedCategories,
    isOpen,
    setIsOpen,
    handleCategoryToggle,
    clearFilters,
    applyFilters
  } = useCategoryFilter();
  
  const { data: categories } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null)
        .order('category');

      if (error) {
        console.error('Error fetching categories:', error);
        throw error;
      }

      // Log para debug
      console.log('Raw categories data:', data);

      const uniqueCategories = [...new Set(data.map(item => item.category))];
      
      // Log para debug
      console.log('Unique categories:', uniqueCategories);
      
      return uniqueCategories;
    }
  });

  return (
    <div className="space-y-4">
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            {selectedCategories.length > 0 
              ? `${selectedCategories.length} selected`
              : "Select Categories"}
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-4 bg-white" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              {categories?.map((category) => (
                <CategoryCheckbox
                  key={category}
                  category={category}
                  isSelected={selectedCategories.includes(category)}
                  onToggle={handleCategoryToggle}
                />
              ))}
            </div>
            
            <FilterActions
              onClear={clearFilters}
              onApply={applyFilters}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CatalogFilters;