import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { X, GripVertical, Star } from "lucide-react";
import { ProductImage } from "@/types/product";
import { cn } from "@/lib/utils";

interface SortableImageProps {
  image: ProductImage;
  onDelete: (id: string, event: React.MouseEvent) => void;
  onSetPrimary: (id: string) => void;
}

export const SortableImage = ({ image, onDelete, onSetPrimary }: SortableImageProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: image.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative group aspect-square"
    >
      <div 
        className="w-full h-full rounded-lg border border-gray-200 overflow-hidden"
      >
        <div {...attributes} {...listeners} className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100">
          <GripVertical className="w-5 h-5 text-white drop-shadow-lg cursor-grab" />
        </div>
        
        <div className="absolute top-2 right-2 z-10 flex gap-2">
          <Button
            type="button"
            size="icon"
            variant={image.is_primary ? "default" : "secondary"}
            className={cn(
              "opacity-0 group-hover:opacity-100 transition-opacity",
              image.is_primary && "opacity-100"
            )}
            onClick={() => onSetPrimary(image.id)}
          >
            <Star className={cn(
              "w-4 h-4",
              image.is_primary ? "fill-current" : "fill-none"
            )} />
          </Button>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="opacity-0 group-hover:opacity-100"
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