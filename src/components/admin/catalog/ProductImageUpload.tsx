import { useCallback, useState } from "react";
import { DndContext, closestCenter, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, GripVertical } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductImage } from "@/types/product";

interface ProductImageUploadProps {
  productId: string;
  images: ProductImage[];
  onImagesUpdate: () => void;
}

const SortableImage = ({ image, onDelete }: { image: ProductImage; onDelete: (id: string) => void }) => {
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
      className={`relative group ${image.is_primary ? 'col-span-2 row-span-2' : ''}`}
    >
      <div {...attributes} {...listeners} className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100">
        <GripVertical className="w-5 h-5 text-white drop-shadow-lg" />
      </div>
      <Button
        variant="destructive"
        size="icon"
        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100"
        onClick={() => onDelete(image.id)}
      >
        <X className="w-4 h-4" />
      </Button>
      <img
        src={image.image_url}
        alt={`Product image ${image.position + 1}`}
        className="w-full h-full object-cover rounded-lg"
      />
      {image.is_primary && (
        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
          Primary Image
        </div>
      )}
    </div>
  );
};

export function ProductImageUpload({ productId, images, onImagesUpdate }: ProductImageUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const filePath = `${productId}/${crypto.randomUUID()}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('product-images')
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath);

        await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: publicUrl,
            position: images.length + i,
            is_primary: images.length === 0 && i === 0
          });
      }

      onImagesUpdate();
      
      toast({
        title: "Success",
        description: "Images uploaded successfully",
      });
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload images",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = images.findIndex(img => img.id === active.id);
    const newIndex = images.findIndex(img => img.id === over.id);

    const reorderedImages = [...images];
    const [movedImage] = reorderedImages.splice(oldIndex, 1);
    reorderedImages.splice(newIndex, 0, movedImage);

    try {
      const updates = reorderedImages.map((img, index) => ({
        id: img.id,
        position: index,
        is_primary: index === 0
      }));

      await supabase
        .from('product_images')
        .upsert(updates);

      onImagesUpdate();
    } catch (error) {
      console.error('Error reordering images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reorder images",
      });
    }
  }, [images, onImagesUpdate, toast]);

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