import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface PermissionDeniedDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PermissionDeniedDialog = ({
  open,
  onOpenChange,
}: PermissionDeniedDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Permission Denied</DialogTitle>
          <DialogDescription>
            Users with this profile don't have permission to select products.
          </DialogDescription>
        </DialogHeader>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => onOpenChange(false)}
        >
          Close
        </Button>
      </DialogContent>
    </Dialog>
  );
};