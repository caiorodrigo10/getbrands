import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import { ProductImage } from "@/types/product";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface SortableImageProps {
  image: ProductImage;
  onDelete: (id: string, event: React.MouseEvent) => void;
}

export const SortableImage = ({ image, onDelete }: SortableImageProps) => {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: image.id,
    transition: {
      duration: 250,
      easing: 'cubic-bezier(0.25, 1, 0.5, 1)',
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 2 : 1,
    position: "relative" as const,
    touchAction: 'none',
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group aspect-square bg-white rounded-lg border border-gray-200",
        isDragging && "opacity-80 shadow-lg"
      )}
    >
      <div className="w-full h-full overflow-hidden">
        <div {...attributes} {...listeners} className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-gray-600 drop-shadow-lg" />
        </div>
        
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => onDelete(image.id, e)}
        >
          <X className="w-4 h-4" />
        </Button>

        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}

        <img
          src={imageError ? '/placeholder.svg' : image.image_url}
          alt={`Product image ${image.position}`}
          className={cn(
            "w-full h-full object-contain p-2 transition-opacity duration-200",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
          draggable={false}
        />
      </div>
    </div>
  );
};