import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductEditForm } from "@/components/admin/catalog/ProductEditForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/product";

const AdminProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const isNewProduct = id === 'new';

  const { data: product, isLoading } = useQuery({
    queryKey: ["admin-product", id],
    queryFn: async () => {
      if (isNewProduct) {
        return {
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
      }

      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: Boolean(id),
  });

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      if (isNewProduct) {
        const { error } = await supabase
          .from('products')
          .insert({
            name: updatedProduct.name,
            category: updatedProduct.category,
            description: updatedProduct.description,
            from_price: updatedProduct.from_price,
            srp: updatedProduct.srp,
            is_new: updatedProduct.is_new,
            is_tiktok: updatedProduct.is_tiktok,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product created successfully",
        });
      } else {
        const { error } = await supabase
          .from('products')
          .update({
            name: updatedProduct.name,
            category: updatedProduct.category,
            description: updatedProduct.description,
            from_price: updatedProduct.from_price,
            srp: updatedProduct.srp,
            is_new: updatedProduct.is_new,
            is_tiktok: updatedProduct.is_tiktok,
          })
          .eq('id', updatedProduct.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      }
      
      navigate("/admin/catalog");
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save product",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-[600px] w-full" />
      </div>
    );
  }

  if (!product) return null;

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
          <h1 className="text-2xl font-semibold">
            {isNewProduct ? "Create New Product" : "Edit Product"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isNewProduct 
              ? "Add a new product to your catalog"
              : "Make changes to your product information"
            }
          </p>
        </div>
      </div>

      <ProductEditForm
        product={product}
        onSubmit={handleUpdateProduct}
        onCancel={() => navigate("/admin/catalog")}
      />
    </div>
  );
};

export default AdminProductEdit;