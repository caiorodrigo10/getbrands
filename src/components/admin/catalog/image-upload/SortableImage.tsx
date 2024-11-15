import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import { ProductImage } from "@/types/product";
import { cn } from "@/lib/utils";

interface SortableImageProps {
  image: ProductImage;
  onDelete: (id: string, event: React.MouseEvent) => void;
}

export const SortableImage = ({ image, onDelete }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || "transform 200ms cubic-bezier(0.25, 1, 0.5, 1)",
    zIndex: isDragging ? 2 : 1,
    position: "relative" as const,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group aspect-square",
        isDragging && "opacity-80"
      )}
    >
      <div 
        className="w-full h-full rounded-lg border border-gray-200 overflow-hidden"
      >
        <div {...attributes} {...listeners} className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
          <GripVertical className="w-5 h-5 text-white drop-shadow-lg cursor-grab" />
        </div>
        
        <div className="absolute top-2 right-2 z-10">
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => onDelete(image.id, e)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <img
          src={image.image_url}
          alt={`Product image ${image.position + 1}`}
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};