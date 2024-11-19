import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ProductEditForm } from "@/components/admin/catalog/ProductEditForm";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { ProductImage } from "@/types/product";

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [tempImages, setTempImages] = useState<ProductImage[]>([]);

  // Query temporary images
  const { data: storageImages = [] } = useQuery({
    queryKey: ['temp-product-images'],
    queryFn: async () => {
      const { data } = await supabase.storage
        .from('product-images')
        .list('temp');
      
      if (!data) return [];

      return data.map((file, index) => ({
        id: `temp-${file.id}`,
        product_id: 'temp',
        image_url: supabase.storage.from('product-images').getPublicUrl(`temp/${file.name}`).data.publicUrl,
        position: index,
        is_primary: index === 0,
        created_at: file.created_at,
        updated_at: file.created_at
      }));
    }
  });

  const handleCreateProduct = async (productData: any) => {
    try {
      // First, create the product
      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          category: productData.category,
          description: productData.description,
          from_price: productData.from_price,
          srp: productData.srp,
          is_new: productData.is_new,
          is_tiktok: productData.is_tiktok,
        })
        .select()
        .single();

      if (productError) throw productError;

      // Process both temporary storage files and media library selections
      const allImages = [...tempImages, ...storageImages];
      
      for (const image of allImages) {
        let finalImageUrl = image.image_url;

        // If it's a temp storage file, move it to the product folder
        if (image.image_url.includes('/temp/')) {
          const fileName = image.image_url.split('/').pop();
          if (fileName) {
            const { error: moveError } = await supabase.storage
              .from('product-images')
              .move(`temp/${fileName}`, `${newProduct.id}/${fileName}`);

            if (moveError) {
              console.error('Error moving file:', moveError);
              continue;
            }

            finalImageUrl = supabase.storage
              .from('product-images')
              .getPublicUrl(`${newProduct.id}/${fileName}`).data.publicUrl;
          }
        }

        // Create database entry for the image
        const { error: imageError } = await supabase
          .from('product_images')
          .insert({
            product_id: newProduct.id,
            image_url: finalImageUrl,
            position: image.position,
            is_primary: image.is_primary
          });

        if (imageError) {
          console.error('Error creating image entry:', imageError);
          continue;
        }

        // Update the product with the main image URL if this is the first image
        if (image.is_primary) {
          const { error: updateError } = await supabase
            .from('products')
            .update({ image_url: finalImageUrl })
            .eq('id', newProduct.id);

          if (updateError) {
            console.error('Error updating product image:', updateError);
          }
        }
      }

      // Clear the temporary images
      setTempImages([]);
      queryClient.invalidateQueries({ queryKey: ['temp-product-images'] });

      toast({
        title: "Success",
        description: "Product created successfully",
      });
      
      navigate(`/admin/catalog/${newProduct.id}`);
    } catch (error) {
      console.error('Error creating product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create product",
      });
    }
  };

  const handleMediaLibrarySelect = (selectedUrls: string[]) => {
    const newImages = selectedUrls.map((url, index) => ({
      id: `media-${Date.now()}-${index}`,
      product_id: 'temp',
      image_url: url,
      position: tempImages.length + index,
      is_primary: tempImages.length === 0 && index === 0,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }));

    setTempImages(prev => [...prev, ...newImages]);
  };

  const emptyProduct = {
    id: '',
    name: '',
    category: '',
    description: '',
    from_price: 0,
    srp: 0,
    is_new: false,
    is_tiktok: false,
    image_url: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate("/admin/catalog")}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Create New Product</h1>
          <p className="text-muted-foreground mt-1">
            Add a new product to your catalog
          </p>
        </div>
      </div>

      <ProductEditForm
        product={emptyProduct}
        onSubmit={handleCreateProduct}
        onCancel={() => navigate("/admin/catalog")}
        onMediaLibrarySelect={handleMediaLibrarySelect}
        tempImages={tempImages}
      />
    </div>
  );
};

export default AdminProductCreate;