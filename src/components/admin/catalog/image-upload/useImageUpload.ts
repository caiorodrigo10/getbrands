import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useImageUpload = (productId: string, onImagesUpdate: () => void) => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    const files = event.target.files;
    
    if (!files || files.length === 0) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "No files selected",
      });
      return;
    }

    setIsUploading(true);
    try {
      const uploadedImages = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const fileExt = file.name.split('.').pop();
        const fileName = `${productId || 'temp'}/${crypto.randomUUID()}.${fileExt}`;

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

        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(fileName);

        if (productId) {
          const { error: dbError } = await supabase
            .from('product_images')
            .insert({
              product_id: productId,
              image_url: publicUrl,
              position: i,
              is_primary: !uploadedImages.length
            });

          if (dbError) {
            console.error('Database error:', dbError);
            continue;
          }
        }

        uploadedImages.push({
          id: `temp-${Date.now()}-${i}`,
          product_id: productId || 'temp',
          image_url: publicUrl,
          position: i,
          is_primary: !uploadedImages.length,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
      }

      onImagesUpdate();
    } catch (error) {
      console.error('Error uploading images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload images",
      });
    } finally {
      setIsUploading(false);
      const input = document.getElementById('image-upload') as HTMLInputElement;
      if (input) input.value = '';
    }
  };

  return { isUploading, handleFileUpload };
};