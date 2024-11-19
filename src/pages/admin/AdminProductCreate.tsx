import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ProductEditForm } from "@/components/admin/catalog/ProductEditForm";
import { supabase } from "@/integrations/supabase/client";

const AdminProductCreate = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleCreateProduct = async (productData: any) => {
    try {
      const { data, error } = await supabase
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

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product created successfully",
      });
      
      // Redirect to edit page after creation
      navigate(`/admin/catalog/${data.id}`);
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