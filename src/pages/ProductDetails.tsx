import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import ProductHeader from "@/components/products/ProductHeader";
import { ProductBenefits } from "@/components/products/ProductBenefits";
import { ProductCalculator } from "@/components/products/ProductCalculator";
import { useCartOperations } from "@/hooks/useCartOperations";

const ProductDetails = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const { addItem } = useCartOperations();

  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Product;
    },
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Error loading product",
      description: "Failed to load product details. Please try again.",
    });
  }

  if (isLoading) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <Skeleton className="w-full aspect-square rounded-lg" />
          </div>
          <div className="w-full md:w-1/2 space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-4/6" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container max-w-6xl mx-auto px-4 py-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold text-gray-900">Product not found</h2>
          <p className="mt-2 text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="space-y-6">
          <ProductHeader product={product} />
          <div className="border-t border-gray-200 pt-6">
            <ProductBenefits />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-200 pt-8">
        <div className="max-w-3xl mx-auto">
          <ProductCalculator product={product} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;