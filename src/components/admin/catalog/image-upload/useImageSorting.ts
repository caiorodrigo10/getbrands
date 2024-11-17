import { useCallback } from "react";
import { DragEndEvent } from "@dnd-kit/core";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { ProductImage } from "@/types/product";
import { arrayMove } from "@dnd-kit/sortable";
import { useQueryClient } from "@tanstack/react-query";

export const useImageSorting = (images: ProductImage[], onImagesUpdate: () => void) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over || active.id === over.id) return;

    const oldIndex = images.findIndex(img => img.id === active.id);
    const newIndex = images.findIndex(img => img.id === over.id);

    // Create new array with updated positions
    const reorderedImages = arrayMove(images, oldIndex, newIndex);

    try {
      // Update positions and set first image as primary
      const updates = reorderedImages.map((img, index) => ({
        id: img.id,
        position: index,
        is_primary: index === 0 // First image is always primary
      }));

      const { error } = await supabase
        .from('product_images')
        .upsert(updates);

      if (error) throw error;

      // Update the product's main image_url with the first image
      if (reorderedImages.length > 0) {
        const { error: productError } = await supabase
          .from('products')
          .update({ image_url: reorderedImages[0].image_url })
          .eq('id', reorderedImages[0].product_id);

        if (productError) throw productError;
      }

      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ['product-images'] });
      
      onImagesUpdate();
    } catch (error) {
      console.error('Error reordering images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to reorder images",
      });
    }
  }, [images, onImagesUpdate, toast, queryClient]);

  return { handleDragEnd };
};