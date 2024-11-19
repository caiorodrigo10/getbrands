import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImportFileUpload } from "./import/ImportFileUpload";
import { ImportFieldMapping } from "./import/ImportFieldMapping";
import { ImportConfirmation } from "./import/ImportConfirmation";
import { useImportDialog } from "./import/useImportDialog";

interface ImportProductsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportProductsDialog = ({ open, onOpenChange }: ImportProductsDialogProps) => {
  const {
    headers,
    mappings,
    step,
    isProcessing,
    handleFileUpload,
    handleMapping,
    handleImport,
    setStep
  } = useImportDialog({
    entityType: 'products',
    onClose: () => onOpenChange(false)
  });

  const productFields = [
    { value: "name", label: "Product Name" },
    { value: "category", label: "Category" },
    { value: "description", label: "Description" },
    { value: "from_price", label: "Cost Price" },
    { value: "srp", label: "Retail Price" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Products</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 'upload' && (
            <ImportFileUpload onFileUpload={handleFileUpload} />
          )}

          {step === 'map' && (
            <ImportFieldMapping
              headers={headers}
              mappings={mappings}
              fields={productFields}
              onMapping={handleMapping}
              onContinue={() => setStep('confirm')}
            />
          )}

          {step === 'confirm' && (
            <ImportConfirmation
              mappings={mappings}
              fields={productFields}
              isProcessing={isProcessing}
              onConfirm={handleImport}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};