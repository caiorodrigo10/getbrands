import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarDays } from "lucide-react";

interface InsufficientPointsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onScheduleCall: () => void;
}

export const InsufficientPointsDialog = ({
  open,
  onOpenChange,
  onScheduleCall,
}: InsufficientPointsDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Insufficient Points</DialogTitle>
          <DialogDescription>
            You don't have enough points to select this product.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button className="w-full" onClick={onScheduleCall}>
            <CalendarDays className="mr-2 h-4 w-4" />
            Schedule a Call with Our Team
          </Button>
          <Button
            variant="outline"
            className="w-full"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};