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

  useEffect(() => {
    const syncProfileImage = async () => {
      const { data: product } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', productId)
        .single();

      // Only add the profile image if it's not already in the images array
      if (product?.image_url && !images.some(img => img.image_url === product.image_url)) {
        // Check if there's already a primary image
        const hasPrimaryImage = images.some(img => img.is_primary);
        
        await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: product.image_url,
            position: 0,
            is_primary: !hasPrimaryImage // Only set as primary if there isn't one already
          });
        onImagesUpdate();
      }
    };

    syncProfileImage();
  }, [productId, images, onImagesUpdate]);

  const handleDeleteImage = async (imageId: string) => {
    try {
      const imageToDelete = images.find(img => img.id === imageId);
      await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      // If we deleted the primary image, make the first remaining image primary
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
          onClick={() => document.getElementById('image-upload')?.click()}
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
          items={images.map(img => img.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {images.map((image) => (
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