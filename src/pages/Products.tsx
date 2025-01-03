import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Confetti from 'react-confetti';
import { useLocation, useNavigate } from "react-router-dom";
import { ProductNameEdit } from "@/components/products/ProductNameEdit";
import { ProductPricing } from "@/components/products/ProductPricing";
import { ProductPriceInfo } from "@/components/products/ProductPriceInfo";
import { ProjectProduct } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";

const Products = () => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const { toast } = useToast();

  const { data: products, isLoading, error, refetch } = useQuery({
    queryKey: ['my-products', user?.id],
    queryFn: async () => {
      if (!user?.id) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('project_products')
        .select(`
          id,
          project:projects (
            id,
            name,
            description
          ),
          product:products (*),
          specific:project_specific_products (
            id,
            name,
            description,
            main_image_url,
            images,
            selling_price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) {
        toast({
          variant: "destructive",
          title: "Error loading products",
          description: error.message
        });
        throw error;
      }
      return data as ProjectProduct[];
    },
    enabled: !!user?.id && isAuthenticated,
    retry: 1,
  });

  useEffect(() => {
    const showCelebration = location.state?.fromProductSelection || false;
    
    if (showCelebration) {
      navigate(location.pathname, { replace: true });
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state, navigate, location.pathname]);

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      refetch();
    }
  }, [isAuthenticated, user?.id, refetch]);

  if (!isAuthenticated) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Please log in to view your products.</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[500px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600">Error loading products. Please try again.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showConfetti && <Confetti />}
      <h1 className="text-3xl font-bold">My Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products?.map((item, index) => {
          const specificProduct = item.specific?.[0];
          const displayName = specificProduct?.name || item.product?.name || 'Unnamed Product';
          // Use the specific product's main image if available, otherwise fallback to original product image
          const displayImage = specificProduct?.main_image_url || item.product?.image_url;
          
          return (
            <Card 
              key={item.id}
              className="p-6 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={displayImage || "/placeholder.svg"}
                  alt={displayName}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-4">
                <div>
                  <ProductNameEdit
                    projectProductId={item.id}
                    currentName={displayName}
                    onNameUpdate={() => refetch()}
                  />
                  <p className="text-sm text-gray-600 mt-1">{item.product?.category || 'Uncategorized'}</p>
                </div>
                
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-grow space-y-3">
                      <p className="text-sm font-medium text-gray-700">Original Product:</p>
                      <p className="text-sm text-gray-600 hover:text-primary cursor-pointer"
                         onClick={() => item.product?.id && navigate(`/catalog/${item.product.id}`)}>
                        {item.product?.name || 'Product name not available'}
                      </p>
                    </div>
                    <div 
                      className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                      onClick={() => item.product?.id && navigate(`/catalog/${item.product.id}`)}
                    >
                      <img
                        src={item.product?.image_url || "/placeholder.svg"}
                        alt={item.product?.name || 'Product image'}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </div>
                </div>

                <ProductPriceInfo
                  costPrice={item.product?.from_price || 0}
                  suggestedPrice={item.product?.srp || 0}
                />

                <ProductPricing
                  projectProductId={item.id}
                  costPrice={item.product?.from_price || 0}
                  suggestedPrice={item.product?.srp || 0}
                  currentSellingPrice={specificProduct?.selling_price || undefined}
                  onPriceUpdate={() => refetch()}
                />
                
                {item.project && (
                  <div className="pt-2 border-t">
                    <p className="text-sm font-medium text-gray-700">Project:</p>
                    <p className="text-sm text-gray-600">{item.project.name}</p>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
        {products?.length === 0 && (
          <div className="col-span-full text-center py-12">
            <p className="text-lg text-gray-600">No products selected yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;