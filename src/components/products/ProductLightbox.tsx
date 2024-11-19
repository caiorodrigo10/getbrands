import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ProductLightboxProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedImage: string;
  productName: string;
  onPrevious: () => void;
  onNext: () => void;
}

export const ProductLightbox = ({
  open,
  onOpenChange,
  selectedImage,
  productName,
  onPrevious,
  onNext,
}: ProductLightboxProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent 
        className="max-w-4xl p-0 bg-transparent border-none shadow-none" 
        onPointerDownOutside={() => onOpenChange(false)}
        onInteractOutside={() => onOpenChange(false)}
      >
        <div 
          className="relative flex items-center justify-center min-h-[70vh]"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onOpenChange(false);
            }
          }}
        >
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 text-white hover:bg-white/20"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              onPrevious();
            }}
          >
            <ChevronLeft className="h-8 w-8" />
          </Button>

          <div 
            className="bg-white rounded-lg p-8 max-h-[70vh] w-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedImage}
              alt={productName}
              className="max-h-[60vh] w-auto object-contain"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:bg-white/20"
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
          >
            <ChevronRight className="h-8 w-8" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};