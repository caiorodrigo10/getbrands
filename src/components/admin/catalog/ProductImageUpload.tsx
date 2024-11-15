import { DndContext, DragOverlay, closestCenter, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductImage } from "@/types/product";
import { SortableImage } from "./image-upload/SortableImage";
import { useImageUpload } from "./image-upload/useImageUpload";
import { useImageSorting } from "./image-upload/useImageSorting";
import { useToast } from "@/components/ui/use-toast";
import { useQueryClient } from "@tanstack/react-query";

interface ProductImageUploadProps {
  productId: string;
  images: ProductImage[];
  onImagesUpdate: () => void;
}

export function ProductImageUpload({ productId, images, onImagesUpdate }: ProductImageUploadProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isUploading, handleFileUpload } = useImageUpload(productId, onImagesUpdate);
  const { handleDragEnd } = useImageSorting(images, onImagesUpdate);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // Remove duplicates based on image_url
  const uniqueImages = images.filter((image, index, self) =>
    index === self.findIndex((t) => t.image_url === image.image_url)
  );

  const handleDeleteImage = async (imageId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const imageToDelete = images.find(img => img.id === imageId);
      await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      // If we're deleting the first image and there are other images,
      // update the product's main image_url with the next available image
      if (imageToDelete?.position === 0 && images.length > 1) {
        const nextImage = images.find(img => img.id !== imageId);
        if (nextImage) {
          await supabase
            .from('products')
            .update({ image_url: nextImage.image_url })
            .eq('id', productId);
        }
      }

      // Invalidate all queries that depend on product images
      queryClient.invalidateQueries({ queryKey: ['product-images'] });
      queryClient.invalidateQueries({ queryKey: ['product', productId] });
      
      onImagesUpdate();
      toast({
        title: "Success",
        description: "Image deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete image",
      });
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    handleFileUpload(e);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            document.getElementById('image-upload')?.click();
          }}
          disabled={isUploading}
        >
          <ImagePlus className="w-4 h-4 mr-2" />
          {isUploading ? 'Uploading...' : 'Add Images'}
        </Button>
        <input
          id="image-upload"
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={handleFileInputChange}
          disabled={isUploading}
        />
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={uniqueImages.map(img => img.id)}
          strategy={rectSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uniqueImages.map((image) => (
              <SortableImage
                key={image.id}
                image={image}
                onDelete={handleDeleteImage}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}