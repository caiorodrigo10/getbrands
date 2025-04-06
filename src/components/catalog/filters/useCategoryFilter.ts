
import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

export const useCategoryFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  // Synchronize state with URL parameters when the component mounts
  useEffect(() => {
    const categoriesParam = searchParams.get("categories");
    if (categoriesParam) {
      const decodedCategories = decodeURIComponent(categoriesParam)
        .split(",")
        .map(cat => cat.trim());
      setSelectedCategories(decodedCategories);
    } else {
      setSelectedCategories([]);
    }
  }, [searchParams]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
      const normalizedCategory = category.trim();
      if (prev.includes(normalizedCategory)) {
        return prev.filter(c => c !== normalizedCategory);
      } else {
        return [...prev, normalizedCategory];
      }
    });
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("categories");
    setSearchParams(newParams);
    setIsOpen(false);
  };

  const applyFilters = () => {
    const newParams = new URLSearchParams(searchParams);
    if (selectedCategories.length > 0) {
      // Correctly encode the categories as a URL parameter
      const encodedCategories = encodeURIComponent(
        selectedCategories.join(",")
      );
      newParams.set("categories", encodedCategories);
    } else {
      newParams.delete("categories");
    }
    setSearchParams(newParams);
    setIsOpen(false);
  };

  return {
    selectedCategories,
    isOpen,
    setIsOpen,
    handleCategoryToggle,
    clearFilters,
    applyFilters
  };
};
