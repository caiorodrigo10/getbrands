import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

interface AddStageButtonProps {
  onAddStage: (stageName: string) => Promise<void>;
  projectId: string;
}

export const AddStageButton = ({ onAddStage, projectId }: AddStageButtonProps) => {
  const [stageName, setStageName] = useState("");
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!stageName.trim()) {
      return;
    }
    
    try {
      await onAddStage(stageName);
      setStageName("");
      setOpen(false);
      toast.success("Stage added successfully");
    } catch (error) {
      console.error('Failed to add stage:', error);
      toast.error("Failed to add stage");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="w-full mt-4">
          <Plus className="h-4 w-4 mr-2" />
          Add New Stage
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Project Stage</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Input
              placeholder="Stage name"
              value={stageName}
              onChange={(e) => setStageName(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full">Add Stage</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};