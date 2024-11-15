import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { X, GripVertical } from "lucide-react";
import { ProductImage } from "@/types/product";

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
        <Button
          type="button"
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100"
          onClick={(e) => onDelete(image.id, e)}
        >
          <X className="w-4 h-4" />
        </Button>
        <img
          src={image.image_url}
          alt={`Product image ${image.position + 1}`}
          className="w-full h-full object-cover"
        />
        {image.is_primary && (
          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            Primary Image
          </div>
        )}
      </div>
    </div>
  );
};