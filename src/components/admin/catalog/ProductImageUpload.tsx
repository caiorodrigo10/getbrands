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
  mainImageUrl?: string | null;
  onImagesUpdate: () => void;
}

export function ProductImageUpload({ productId, images, mainImageUrl, onImagesUpdate }: ProductImageUploadProps) {
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

  // Include the main image if it exists and isn't already in the images array
  const allImages = mainImageUrl && !images.some(img => img.image_url === mainImageUrl)
    ? [{ 
        id: 'main-image', 
        product_id: productId, 
        image_url: mainImageUrl, 
        position: -1,
        is_primary: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }, ...images]
    : images;

  // Remove duplicates based on image_url
  const uniqueImages = allImages.filter((image, index, self) =>
    index === self.findIndex((t) => t.image_url === image.image_url)
  );

  const handleDeleteImage = async (imageId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Get the image details before deletion
      const imageToDelete = images.find(img => img.id === imageId);
      if (!imageToDelete) {
        throw new Error('Image not found');
      }

      // Extract the file path from the URL
      const fileUrl = new URL(imageToDelete.image_url);
      const filePath = fileUrl.pathname.split('/').pop();

      // Delete from storage first
      const { error: storageError } = await supabase.storage
        .from('product-images')
        .remove([`${filePath}`]);

      if (storageError) {
        console.error('Storage deletion error:', storageError);
      }

      // Then delete from the database
      const { error: deleteError } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (deleteError) throw deleteError;

      // If we successfully deleted the image, update the UI
      queryClient.invalidateQueries({ queryKey: ['product-images', productId] });
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
        description: "Failed to delete image. Please try again.",
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