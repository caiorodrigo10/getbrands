import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface ImportFieldMappingProps {
  headers: string[];
  mappings: Record<string, string>;
  fields: { value: string; label: string }[];
  onMapping: (header: string, field: string) => void;
  onContinue: () => void;
}

export const ImportFieldMapping = ({ 
  headers, 
  mappings, 
  fields, 
  onMapping, 
  onContinue 
}: ImportFieldMappingProps) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Map your CSV columns to fields
      </p>
      {headers.map((header) => (
        <div key={header} className="flex items-center gap-4">
          <span className="min-w-[200px] text-sm">{header}</span>
          <Select
            value={mappings[header]}
            onValueChange={(value) => onMapping(header, value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select field" />
            </SelectTrigger>
            <SelectContent>
              {fields.map((field) => (
                <SelectItem key={field.value} value={field.value}>
                  {field.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
      <Button
        className="mt-4"
        onClick={onContinue}
        disabled={Object.keys(mappings).length === 0}
      >
        Continue
      </Button>
    </div>
  );
};