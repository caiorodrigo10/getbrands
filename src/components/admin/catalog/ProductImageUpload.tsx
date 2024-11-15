import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { ProductImage } from "@/types/product";
import { SortableImage } from "./image-upload/SortableImage";
import { useImageUpload } from "./image-upload/useImageUpload";
import { useImageSorting } from "./image-upload/useImageSorting";
import { useToast } from "@/components/ui/use-toast";
import { useEffect } from "react";

interface ProductImageUploadProps {
  productId: string;
  images: ProductImage[];
  onImagesUpdate: () => void;
}

export function ProductImageUpload({ productId, images, onImagesUpdate }: ProductImageUploadProps) {
  const { toast } = useToast();
  const { isUploading, handleFileUpload } = useImageUpload(productId, onImagesUpdate);
  const { handleDragEnd } = useImageSorting(images, onImagesUpdate);

  // Remove duplicates based on image_url
  const uniqueImages = images.filter((image, index, self) =>
    index === self.findIndex((t) => t.image_url === image.image_url)
  );

  const handleSetPrimary = async (imageId: string) => {
    try {
      // First, set all images as non-primary
      await supabase
        .from('product_images')
        .update({ is_primary: false })
        .eq('product_id', productId);

      // Then set the selected image as primary
      await supabase
        .from('product_images')
        .update({ is_primary: true })
        .eq('id', imageId);

      // Update the product's main image_url
      const selectedImage = images.find(img => img.id === imageId);
      if (selectedImage) {
        await supabase
          .from('products')
          .update({ image_url: selectedImage.image_url })
          .eq('id', productId);
      }

      onImagesUpdate();
      toast({
        title: "Success",
        description: "Primary image updated successfully",
      });
    } catch (error) {
      console.error('Error setting primary image:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to set primary image",
      });
    }
  };

  const handleDeleteImage = async (imageId: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      const imageToDelete = images.find(img => img.id === imageId);
      await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (imageToDelete?.is_primary && images.length > 1) {
        const nextImage = images.find(img => img.id !== imageId);
        if (nextImage) {
          await supabase
            .from('product_images')
            .update({ is_primary: true })
            .eq('id', nextImage.id);
        }
      }

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
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext 
          items={uniqueImages.map(img => img.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {uniqueImages.map((image) => (
              <SortableImage
                key={image.id}
                image={image}
                onDelete={handleDeleteImage}
                onSetPrimary={handleSetPrimary}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}