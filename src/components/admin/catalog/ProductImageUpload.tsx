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

      if (product?.image_url && images.length === 0) {
        await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: product.image_url,
            position: 0,
            is_primary: true
          });
        onImagesUpdate();
      }
    };

    syncProfileImage();
  }, [productId, images.length, onImagesUpdate]);

  const handleDeleteImage = async (imageId: string) => {
    try {
      await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

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

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Button
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
          onChange={handleFileUpload}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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