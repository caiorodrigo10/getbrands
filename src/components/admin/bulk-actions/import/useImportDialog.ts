import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface UseImportDialogProps {
  entityType: string;
  onClose: () => void;
}

export const useImportDialog = ({ entityType, onClose }: UseImportDialogProps) => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [step, setStep] = useState<'upload' | 'map' | 'confirm'>('upload');
  const [isProcessing, setIsProcessing] = useState(false);

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
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      const { error: uploadError } = await supabase.storage
        .from('bulk-imports')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { error: bulkActionError } = await supabase
        .from('bulk_actions')
        .insert({
          action_type: 'import',
          entity_type: entityType,
          status: 'pending',
          details: { mappings },
          file_url: fileName,
        });

      if (bulkActionError) throw bulkActionError;

      toast({
        title: "Import started",
        description: `Your ${entityType} are being imported. You can check the status in the Bulk Actions page.`,
      });
      
      onClose();
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

  return {
    file,
    headers,
    mappings,
    step,
    isProcessing,
    handleFileUpload,
    handleMapping,
    handleImport,
    setStep
  };
};