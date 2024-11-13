import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const CatalogFilters = () => {
  const typeOptions = [
    "Balm",
    "Capsules",
    "Drops",
    "Liquid",
    "Pastilles",
  ];

  return (
    <div className="mb-8 space-y-6">
      <div className="flex gap-4 flex-wrap">
        <Select>
          <SelectTrigger className="w-[180px] bg-white border-gray-200">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="supplements">Supplements</SelectItem>
            <SelectItem value="vitamins">Vitamins</SelectItem>
            <SelectItem value="proteins">Proteins</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px] bg-white border-gray-200">
            <SelectValue placeholder="Audience" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="adults">Adults</SelectItem>
            <SelectItem value="seniors">Seniors</SelectItem>
            <SelectItem value="athletes">Athletes</SelectItem>
          </SelectContent>
        </Select>

        <Select>
          <SelectTrigger className="w-[180px] bg-white border-gray-200">
            <SelectValue placeholder="Purpose" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="energy">Energy</SelectItem>
            <SelectItem value="immunity">Immunity</SelectItem>
            <SelectItem value="sleep">Sleep</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h3 className="font-semibold mb-3">Type</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {typeOptions.map((option) => (
            <div key={option} className="flex items-center space-x-2">
              <Checkbox id={option.toLowerCase()} />
              <label htmlFor={option.toLowerCase()} className="text-sm">
                {option}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CatalogFilters;