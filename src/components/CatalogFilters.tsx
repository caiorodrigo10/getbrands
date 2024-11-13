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

const CatalogFilters = () => {
  return (
    <div className="flex gap-4 mb-8">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] bg-gray-50 text-gray-600 justify-between">
            Category
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="proteins" />
              <label htmlFor="proteins" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Proteins & Blends
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="vitamins" />
              <label htmlFor="vitamins" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Vitamins & Supplements
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="energy" />
              <label htmlFor="energy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Energy & Performance
              </label>
            </div>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t">
            <Button variant="outline" size="sm">Clear</Button>
            <Button size="sm">Apply filter</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] bg-gray-50 text-gray-600 justify-between">
            Type
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="powder" />
              <label htmlFor="powder" className="text-sm font-medium leading-none">Powder</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="capsules" />
              <label htmlFor="capsules" className="text-sm font-medium leading-none">Capsules</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="liquid" />
              <label htmlFor="liquid" className="text-sm font-medium leading-none">Liquid</label>
            </div>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t">
            <Button variant="outline" size="sm">Clear</Button>
            <Button size="sm">Apply filter</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] bg-gray-50 text-gray-600 justify-between">
            Audience
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="adults" />
              <label htmlFor="adults" className="text-sm font-medium leading-none">Adults</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="athletes" />
              <label htmlFor="athletes" className="text-sm font-medium leading-none">Athletes</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="seniors" />
              <label htmlFor="seniors" className="text-sm font-medium leading-none">Seniors</label>
            </div>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t">
            <Button variant="outline" size="sm">Clear</Button>
            <Button size="sm">Apply filter</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] bg-gray-50 text-gray-600 justify-between">
            Purpose
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="muscle" />
              <label htmlFor="muscle" className="text-sm font-medium leading-none">Muscle Growth</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="energy" />
              <label htmlFor="energy" className="text-sm font-medium leading-none">Energy Boost</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="health" />
              <label htmlFor="health" className="text-sm font-medium leading-none">General Health</label>
            </div>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t">
            <Button variant="outline" size="sm">Clear</Button>
            <Button size="sm">Apply filter</Button>
          </div>
        </PopoverContent>
      </Popover>

      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-[150px] bg-gray-50 text-gray-600 justify-between">
            Dietary
            <ChevronDown className="h-4 w-4 text-gray-600" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-4">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="vegan" />
              <label htmlFor="vegan" className="text-sm font-medium leading-none">Vegan</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="gluten-free" />
              <label htmlFor="gluten-free" className="text-sm font-medium leading-none">Gluten Free</label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="organic" />
              <label htmlFor="organic" className="text-sm font-medium leading-none">Organic</label>
            </div>
          </div>
          <div className="flex justify-between mt-4 pt-4 border-t">
            <Button variant="outline" size="sm">Clear</Button>
            <Button size="sm">Apply filter</Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default CatalogFilters;