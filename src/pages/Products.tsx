import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import Confetti from 'react-confetti';
import { useLocation, useNavigate } from "react-router-dom";
import { ProductNameEdit } from "@/components/products/ProductNameEdit";

interface ProjectSpecificProduct {
  id: string;
  name: string | null;
  description: string | null;
  image_url: string | null;
}

interface ProjectProduct {
  id: string;
  project: {
    id: string;
    name: string;
    description: string | null;
  } | null;
  product: {
    id: string;
    name: string;
    category: string;
    image_url: string | null;
  };
  specific: ProjectSpecificProduct[] | null;
}

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
            image_url
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

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">My Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-[300px] w-full" />
          ))}
        </div>
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
          const displayName = specificProduct?.name || item.product.name;
          const displayImage = specificProduct?.image_url || item.product.image_url;
          
          return (
            <Card 
              key={item.id}
              className="p-6 animate-fade-in"
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className="aspect-square mb-4 bg-gray-100 rounded-lg overflow-hidden">
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
                    onNameUpdate={handleNameUpdate}
                  />
                  <p className="text-sm text-gray-600 mt-1">{item.product.category}</p>
                  
                  <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm font-medium text-gray-700 mb-2">Original Product:</p>
                    <p className="text-sm text-gray-600">{item.product.name}</p>
                  </div>
                </div>
                
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