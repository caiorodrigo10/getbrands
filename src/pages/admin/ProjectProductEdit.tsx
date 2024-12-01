import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductEditForm } from "@/components/admin/catalog/ProductEditForm";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/product";
import { useProjectProduct } from "./hooks/useProjectProduct";
import { PageHeader } from "./components/PageHeader";

const ProjectProductEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
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
        };
      }

      const { data, error } = await supabase
        .from("project_specific_products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
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