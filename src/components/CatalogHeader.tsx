import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { useDebounce } from "@/hooks/useDebounce";
import { useEffect, useState } from "react";

const CatalogHeader = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get("search") || "");
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const newSearchParams = new URLSearchParams(searchParams);
    if (debouncedSearch) {
      newSearchParams.set("search", debouncedSearch);
    } else {
      newSearchParams.delete("search");
    }
    setSearchParams(newSearchParams);
  }, [debouncedSearch, setSearchParams]);

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