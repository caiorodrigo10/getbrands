import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Upload } from "lucide-react";
import { BulkAction } from "@/types/bulk-actions";

interface ImportProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportProductsDialog = ({ open, onOpenChange }: ImportProductsDialogProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'upload' | 'map' | 'confirm'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);

  const productFields = [
    { value: "name", label: "Product Name" },
    { value: "category", label: "Category" },
    { value: "description", label: "Description" },
    { value: "from_price", label: "Cost Price" },
    { value: "srp", label: "Retail Price" },
  ];

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== "text/csv") {
      toast({
        variant: "destructive",
        title: "Invalid file type",
        description: "Please upload a CSV file",
      });
      return;
    }

    setFile(file);
    
    // Read CSV headers
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const headers = text.split('\n')[0].split(',').map(h => h.trim());
      setHeaders(headers);
    };
    reader.readAsText(file);
    setStep('map');
  };

  const handleMapping = (header: string, field: string) => {
    setMappings(prev => ({
      ...prev,
      [header]: field
    }));
  };

  const handleImport = async () => {
    if (!file) return;

    setIsProcessing(true);
    try {
      // Upload CSV file
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('bulk-imports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Create bulk action record
      const { error: bulkActionError } = await supabase
        .from('bulk_actions')
        .insert({
          action_type: 'import',
          entity_type: 'products',
          status: 'pending',
          details: { mappings },
          file_url: fileName,
        });

      if (bulkActionError) throw bulkActionError;

      toast({
        title: "Import started",
        description: "Your products are being imported. You can check the status in the Bulk Actions page.",
      });
      
      onOpenChange(false);
    } catch (error) {
      console.error('Import error:', error);
      toast({
        variant: "destructive",
        title: "Import failed",
        description: "There was an error starting the import. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Products</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-8 text-center">
                <Input
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="flex flex-col items-center gap-2 cursor-pointer"
                >
                  <Upload className="h-8 w-8 text-gray-400" />
                  <span className="text-sm text-gray-600">
                    Click to upload or drag and drop a CSV file
                  </span>
                </label>
              </div>
            </div>
          )}

          {step === 'map' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Map your CSV columns to product fields
              </p>
              {headers.map((header) => (
                <div key={header} className="flex items-center gap-4">
                  <span className="min-w-[200px] text-sm">{header}</span>
                  <Select
                    value={mappings[header]}
                    onValueChange={(value) => handleMapping(header, value)}
                  >
                    <SelectTrigger className="w-[200px]">
                      <SelectValue placeholder="Select field" />
                    </SelectTrigger>
                    <SelectContent>
                      {productFields.map((field) => (
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
                onClick={() => setStep('confirm')}
                disabled={Object.keys(mappings).length === 0}
              >
                Continue
              </Button>
            </div>
          )}

          {step === 'confirm' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Review your mappings and confirm the import
              </p>
              {Object.entries(mappings).map(([header, field]) => (
                <div key={header} className="flex items-center gap-4">
                  <span className="min-w-[200px] text-sm font-medium">{header}</span>
                  <span className="text-sm text-muted-foreground">
                    → {productFields.find(f => f.value === field)?.label}
                  </span>
                </div>
              ))}
              <Button
                className="mt-4"
                onClick={handleImport}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing..." : "Start Import"}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
