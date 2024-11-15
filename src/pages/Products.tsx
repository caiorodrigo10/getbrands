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

const Products = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  const { data: products, isLoading, refetch } = useQuery({
    queryKey: ['my-products', user?.id],
    queryFn: async () => {
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
            image_url,
            selling_price
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ProjectProduct[];
    },
    enabled: !!user,
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

  const handleNameUpdate = () => {
    refetch();
  };

  const handlePriceUpdate = () => {
    refetch();
  };

  const navigateToOriginalProduct = (productId: string) => {
    navigate(`/catalog/${productId}`);
  };

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold mb-6">My Products</h1>
        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[200px] w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {showConfetti && <Confetti />}
      <h1 className="text-3xl font-bold mb-6">My Products</h1>
      <div className="flex flex-col gap-4">
        {products?.map((item, index) => {
          const specificProduct = item.specific?.[0];
          const displayName = specificProduct?.name || item.product.name;
          const displayImage = specificProduct?.image_url || item.product.image_url;
          
          return (
            <Card 
              key={item.id}
              className="p-4 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="flex gap-4">
                <div className="w-40 h-40 flex-shrink-0">
                  <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={displayImage || "/placeholder.svg"}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                
                <div className="flex-grow space-y-4">
                  <div>
                    <ProductNameEdit
                      projectProductId={item.id}
                      currentName={displayName}
                      onNameUpdate={handleNameUpdate}
                    />
                    <p className="text-sm text-gray-600 mt-1">{item.product.category}</p>
                  </div>
                  
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-grow space-y-2">
                        <p className="text-sm font-medium text-gray-700">Original Product:</p>
                        <p className="text-sm text-gray-600 hover:text-primary cursor-pointer"
                           onClick={() => navigateToOriginalProduct(item.product.id)}>
                          {item.product.name}
                        </p>
                      </div>
                      <div 
                        className="w-20 h-20 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-75 transition-opacity"
                        onClick={() => navigateToOriginalProduct(item.product.id)}
                      >
                        <img
                          src={item.product.image_url || "/placeholder.svg"}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  <ProductPriceInfo
                    costPrice={item.product.from_price}
                    suggestedPrice={item.product.srp}
                  />

                  <ProductPricing
                    projectProductId={item.id}
                    costPrice={item.product.from_price}
                    suggestedPrice={item.product.srp}
                    currentSellingPrice={specificProduct?.selling_price || undefined}
                    onPriceUpdate={handlePriceUpdate}
                  />
                  
                  {item.project && (
                    <div className="pt-2 border-t">
                      <p className="text-sm font-medium text-gray-700">Project:</p>
                      <p className="text-sm text-gray-600">{item.project.name}</p>
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
        {products?.length === 0 && (
          <div className="text-center py-8">
            <p className="text-lg text-gray-600">No products selected yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;