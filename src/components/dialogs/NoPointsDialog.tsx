import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface NoPointsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const NoPointsDialog = ({ open, onOpenChange }: NoPointsDialogProps) => {
  const handleScheduleCall = () => {
    window.location.href = "https://calendly.com/your-team";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>No Available Points</DialogTitle>
          <DialogDescription className="pt-2">
            You don't have any points available. Schedule a call with our team to learn about our Packs and start creating amazing products!
          </DialogDescription>
        </DialogHeader>
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleScheduleCall}>
            Schedule a Call
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NoPointsDialog;