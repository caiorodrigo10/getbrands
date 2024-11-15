import { useCallback, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "@dnd-kit/core";
import { Button } from "@/components/ui/button";
import { ImagePlus, X, GripVertical } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductImage {
  id: string;
  image_url: string;
  position: number;
  is_primary: boolean;
}

interface ProductImageUploadProps {
  productId: string;
  images: ProductImage[];
  onImagesUpdate: (images: ProductImage[]) => void;
}

export function ProductImageUpload({ productId, images, onImagesUpdate }: ProductImageUploadProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const newImages: ProductImage[] = [];
      
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

        const { data, error } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: publicUrl,
            position: images.length + i,
            is_primary: images.length === 0 && i === 0
          })
          .select()
          .single();

        if (error) throw error;
        if (data) newImages.push(data as ProductImage);
      }

      onImagesUpdate([...images, ...newImages]);
      
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

  const handleDragEnd = useCallback(async (event: any) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = images.findIndex(img => img.id === active.id);
    const newIndex = images.findIndex(img => img.id === over.id);

    const reorderedImages = [...images];
    const [movedImage] = reorderedImages.splice(oldIndex, 1);
    reorderedImages.splice(newIndex, 0, movedImage);

    // Update positions in the database
    try {
      const updates = reorderedImages.map((img, index) => ({
        id: img.id,
        position: index,
        is_primary: index === 0
      }));

      const { error } = await supabase
        .from('product_images')
        .upsert(updates);

      if (error) throw error;

      onImagesUpdate(reorderedImages);
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
      const { error } = await supabase
        .from('product_images')
        .delete()
        .eq('id', imageId);

      if (error) throw error;

      const updatedImages = images.filter(img => img.id !== imageId);
      // Update positions after deletion
      const reorderedImages = updatedImages.map((img, index) => ({
        ...img,
        position: index,
        is_primary: index === 0
      }));

      await supabase
        .from('product_images')
        .upsert(reorderedImages);

      onImagesUpdate(reorderedImages);

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

      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="images">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="grid grid-cols-2 md:grid-cols-4 gap-4"
            >
              {images.map((image, index) => (
                <Draggable key={image.id} draggableId={image.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      className={`relative group ${index === 0 ? 'col-span-2 row-span-2' : ''}`}
                    >
                      <div {...provided.dragHandleProps} className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100">
                        <GripVertical className="w-5 h-5 text-white drop-shadow-lg" />
                      </div>
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100"
                        onClick={() => handleDeleteImage(image.id)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                      <img
                        src={image.image_url}
                        alt={`Product image ${index + 1}`}
                        className="w-full h-full object-cover rounded-lg"
                      />
                      {index === 0 && (
                        <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
                          Primary Image
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}