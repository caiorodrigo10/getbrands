import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductEditForm } from "@/components/admin/catalog/ProductEditForm";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "./components/PageHeader";
import { useProjectProduct } from "./hooks/useProjectProduct";
import { Product } from "@/types/product";

const ProjectProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { handleUpdateProduct, isNewProduct } = useProjectProduct(id);

  const { data: product, isLoading } = useQuery({
    queryKey: ["project-product", id],
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
        } as Product;
      }

      const { data, error } = await supabase
        .from("project_specific_products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      // Transform project specific product to match Product type
      const transformedProduct: Product = {
        id: data.id,
        name: data.name || '',
        category: '',  // Set default category
        description: data.description || '',
        from_price: 0, // Set default price
        srp: 0,        // Set default SRP
        is_new: false, // Set default is_new
        is_tiktok: false, // Set default is_tiktok
        image_url: data.main_image_url,
        created_at: data.created_at,
        updated_at: data.updated_at,
      };

      return transformedProduct;
    },
    enabled: Boolean(id),
  });

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
      <PageHeader
        title={isNewProduct ? "Create New Product" : "Edit Product"}
        description={
          isNewProduct
            ? "Add a new product to your project"
            : "Make changes to your project product information"
        }
        onBack={() => navigate("/admin/projects")}
      />

      <ProductEditForm
        product={product}
        onSubmit={handleUpdateProduct}
        onCancel={() => navigate("/admin/projects")}
      />
    </div>
  );
};

export default ProjectProductEdit;