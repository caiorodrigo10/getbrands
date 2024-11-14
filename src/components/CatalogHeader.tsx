import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const CatalogHeader = () => {
  return (
    <div className="relative flex-1 max-w-md w-full">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
      <Input
        placeholder="Search products..."
        className="pl-10 bg-white border-gray-200 w-full"
      />
    </div>
  );
};

export default CatalogHeader;