import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ImportFileUpload } from "../bulk-actions/import/ImportFileUpload";
import { ImportFieldMapping } from "../bulk-actions/import/ImportFieldMapping";
import { ImportConfirmation } from "../bulk-actions/import/ImportConfirmation";
import { useImportDialog } from "../bulk-actions/import/useImportDialog";

interface ImportContactsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ImportContactsDialog = ({ open, onOpenChange }: ImportContactsDialogProps) => {
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
    entityType: 'contacts',
    onClose: () => onOpenChange(false)
  });

  const contactFields = [
    { value: "first_name", label: "First Name" },
    { value: "last_name", label: "Last Name" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "role", label: "Role" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {step === 'upload' && (
            <ImportFileUpload onFileUpload={handleFileUpload} />
          )}

          {step === 'map' && (
            <ImportFieldMapping
              headers={headers}
              mappings={mappings}
              fields={contactFields}
              onMapping={handleMapping}
              onContinue={() => setStep('confirm')}
            />
          )}

          {step === 'confirm' && (
            <ImportConfirmation
              mappings={mappings}
              fields={contactFields}
              isProcessing={isProcessing}
              onConfirm={handleImport}
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};