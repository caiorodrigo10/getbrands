import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ProductEditForm } from "@/components/admin/catalog/ProductEditForm";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  // Query temporary images
  const { data: tempImages = [] } = useQuery({
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

      // Get all files from storage with temp prefix
      const { data: storageFiles, error: storageError } = await supabase
        .storage
        .from('product-images')
        .list('temp');

      if (storageError) throw storageError;

      // Move files to the new product folder and create database entries
      for (const file of (storageFiles || [])) {
        // Move the file
        const { error: moveError } = await supabase
          .storage
          .from('product-images')
          .move(`temp/${file.name}`, `${newProduct.id}/${file.name}`);

        if (moveError) {
          console.error('Error moving file:', moveError);
          continue;
        }

        // Get the public URL
        const { data: { publicUrl } } = supabase
          .storage
          .from('product-images')
          .getPublicUrl(`${newProduct.id}/${file.name}`);

        // Create database entry
        const { error: imageError } = await supabase
          .from('product_images')
          .insert({
            product_id: newProduct.id,
            image_url: publicUrl,
            position: 0,
            is_primary: true
          });

        if (imageError) {
          console.error('Error creating image entry:', imageError);
          continue;
        }

        // Update the product with the main image URL if this is the first image
        const { error: updateError } = await supabase
          .from('products')
          .update({ image_url: publicUrl })
          .eq('id', newProduct.id);

        if (updateError) {
          console.error('Error updating product image:', updateError);
        }
      }

      toast({
        title: "Success",
        description: "Product created successfully",
      });
      
      // Redirect to edit page after creation
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
      />
    </div>
  );
};

export default AdminProductCreate;