import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useImageUpload = (productId: string, onImagesUpdate: () => void) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      // Check if there's already a primary image
      const { data: existingImages } = await supabase
        .from('product_images')
        .select('is_primary')
        .eq('product_id', productId);

      const hasPrimaryImage = existingImages?.some(img => img.is_primary);

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
            position: i,
            is_primary: !hasPrimaryImage && i === 0 // Only set as primary if there's no primary image and it's the first upload
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
      // Reset the input value to allow uploading the same file again
      const input = document.getElementById('image-upload') as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  return { isUploading, handleFileUpload };
};