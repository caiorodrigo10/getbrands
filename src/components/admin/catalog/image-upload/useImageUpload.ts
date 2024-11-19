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
        const fileName = `${productId}/${crypto.randomUUID()}.${fileExt}`;

        // Upload to storage
        const { error: uploadError, data: uploadData } = await supabase.storage
          .from('product-images')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) {
          console.error('Upload error:', uploadError);
          continue;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        // Insert into database
        const { error: dbError } = await supabase
          .from('product_images')
          .insert({
            product_id: productId,
            image_url: publicUrl,
            position: i,
            is_primary: !hasPrimaryImage && i === 0
          });

        if (dbError) {
          console.error('Database error:', dbError);
          continue;
        }
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