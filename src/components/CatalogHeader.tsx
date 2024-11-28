import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams, useLocation } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

const CatalogHeader = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchTerm, 300);
  const location = useLocation();

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      newSearchParams.set("search", debouncedSearch);
    } else {
      newSearchParams.delete("search");
    }
    
    // Preserve the language prefix when updating search params
    const currentPath = location.pathname;
    setSearchParams(newSearchParams, { 
      replace: true,
      // Preserve the current path to maintain language prefix
      state: { path: currentPath }
    });
  }, [debouncedSearch, setSearchParams, location.pathname]);

  return (
    <div className="relative flex-1">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Search products..."
        className="pl-10 bg-white border-gray-200 w-full"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
};

export default CatalogHeader;