import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Confetti from 'react-confetti';
import { useLocation, useNavigate } from "react-router-dom";

const Produtos = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);

  const { data: products, isLoading } = useQuery({
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
      return data;
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
          // Use project-specific data if available, otherwise use original product data
          const displayName = item.specific?.[0]?.name || item.product.name;
          const displayImage = item.specific?.[0]?.image_url || item.product.image_url;
          
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
                  <h3 className="text-lg font-semibold mb-2">{displayName}</h3>
                  <p className="text-sm text-gray-600">{item.product.category}</p>
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

export default Produtos;