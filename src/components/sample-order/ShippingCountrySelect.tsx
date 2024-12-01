import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface ShippingCountrySelectProps {
  selectedCountry: string;
  onCountryChange?: (value: string) => void;
}

export const ShippingCountrySelect = ({ selectedCountry, onCountryChange }: ShippingCountrySelectProps) => {
  return (
    <div className="w-64">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Shipping Country
      </label>
      <Select 
        value={selectedCountry} 
        onValueChange={onCountryChange}
        disabled
      >
        <SelectTrigger className="bg-white">
          <SelectValue>United States</SelectValue>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="USA">United States</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};