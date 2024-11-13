import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CatalogFilters = () => {
  return (
    <div className="flex gap-4 mb-8">
      <Select>
        <SelectTrigger className="w-[200px] bg-gray-50 text-gray-400 [&>svg]:text-gray-400">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="proteins">Proteins & Blends</SelectItem>
          <SelectItem value="vitamins">Vitamins & Supplements</SelectItem>
          <SelectItem value="energy">Energy & Performance</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[200px] bg-gray-50 text-gray-400 [&>svg]:text-gray-400">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="powder">Powder</SelectItem>
          <SelectItem value="capsules">Capsules</SelectItem>
          <SelectItem value="liquid">Liquid</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[200px] bg-gray-50 text-gray-400 [&>svg]:text-gray-400">
          <SelectValue placeholder="Audience" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="adults">Adults</SelectItem>
          <SelectItem value="athletes">Athletes</SelectItem>
          <SelectItem value="seniors">Seniors</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[200px] bg-gray-50 text-gray-400 [&>svg]:text-gray-400">
          <SelectValue placeholder="Purpose" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="muscle">Muscle Growth</SelectItem>
          <SelectItem value="energy">Energy Boost</SelectItem>
          <SelectItem value="health">General Health</SelectItem>
        </SelectContent>
      </Select>

      <Select>
        <SelectTrigger className="w-[200px] bg-gray-50 text-gray-400 [&>svg]:text-gray-400">
          <SelectValue placeholder="Dietary & Lifestyle" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="vegan">Vegan</SelectItem>
          <SelectItem value="gluten-free">Gluten Free</SelectItem>
          <SelectItem value="organic">Organic</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default CatalogFilters;