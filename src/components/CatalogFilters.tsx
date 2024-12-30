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
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";

const CatalogFilters = () => {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  const { data: categories } = useQuery({
    queryKey: ['product-categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('category')
        .not('category', 'is', null)
        .order('category');

      if (error) throw error;

      // Remove duplicates and format categories
      const uniqueCategories = [...new Set(data.map(item => item.category))];
      return uniqueCategories;
    }
  });

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(category)) {
        return prev.filter(c => c !== category);
      } else {
        return [...prev, category];
      }
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
  };

  return (
    <div className="space-y-4">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[200px] justify-between">
            Select Categories
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-4 bg-white" align="start">
          <div className="space-y-4">
            <div className="space-y-2">
              {categories?.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryToggle(category)}
                  />
                  <label
                    htmlFor={category}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {category}
                  </label>
                </div>
              ))}
            </div>
            
            <div className="flex justify-between">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearFilters}
                className="text-sm"
              >
                Clear
              </Button>
              <Button size="sm" className="text-sm">
                Apply filter
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CatalogFilters;