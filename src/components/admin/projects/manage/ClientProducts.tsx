import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface ClientProductsProps {
  projectId: string;
}

export const ClientProducts = ({ projectId }: ClientProductsProps) => {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [sellingPrice, setSellingPrice] = useState<string>("");

  const { data: projectDetails } = useQuery({
    queryKey: ["project-details", projectId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("projects")
        .select(`
          *,
          project_products (
            id,
            product:products (
              id,
              name,
              category,
              from_price,
              srp,
              image_url
            ),
            specific:project_specific_products (
              id,
              name,
              main_image_url,
              selling_price
            )
          )
        `)
        .eq("id", projectId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  const handleUpdatePrice = async (projectProductId: string) => {
    try {
      const { error } = await supabase
        .from("project_specific_products")
        .update({ selling_price: parseFloat(sellingPrice) })
        .eq("project_product_id", projectProductId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product price updated successfully",
      });
      setEditingProduct(null);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product price",
      });
    }
  };

  const totalPoints = projectDetails?.points || 0;
  const usedPoints = projectDetails?.points_used || 0;
  const remainingPoints = totalPoints - usedPoints;
  const progressPercentage = (usedPoints / totalPoints) * 100;

  if (!projectDetails?.project_products?.length) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Selected Products</h2>
        <p className="text-muted-foreground">No products selected yet.</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div>
          <h2 className="text-lg font-semibold">Selected Products</h2>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Project Points Usage</span>
              <span>{remainingPoints} points remaining</span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{usedPoints} used</span>
              <span>{totalPoints} total</span>
            </div>
          </div>
        </div>

        <div className="grid gap-6">
          {projectDetails.project_products.map((item) => {
            const specificProduct = item.specific?.[0];
            const displayName = specificProduct?.name || item.product?.name;
            const displayImage = specificProduct?.main_image_url || item.product?.image_url;

            return (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex gap-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={displayImage || "/placeholder.svg"}
                      alt={displayName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium">{displayName}</h3>
                    <p className="text-sm text-muted-foreground">{item.product?.category}</p>
                    
                    <div className="mt-2 space-y-2">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Cost Price: </span>
                        <span className="font-medium">${item.product?.from_price}</span>
                      </div>
                      
                      <div className="text-sm">
                        <span className="text-muted-foreground">Suggested Price: </span>
                        <span className="font-medium">${item.product?.srp}</span>
                      </div>

                      <div className="text-sm">
                        <span className="text-muted-foreground">Selling Price: </span>
                        {editingProduct === item.id ? (
                          <div className="flex items-center gap-2 mt-1">
                            <Input
                              type="number"
                              value={sellingPrice}
                              onChange={(e) => setSellingPrice(e.target.value)}
                              className="w-32"
                              placeholder="Enter price"
                            />
                            <Button 
                              size="sm"
                              onClick={() => handleUpdatePrice(item.id)}
                            >
                              Save
                            </Button>
                            <Button 
                              size="sm"
                              variant="outline"
                              onClick={() => setEditingProduct(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              ${specificProduct?.selling_price || item.product?.srp}
                            </span>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingProduct(item.id);
                                setSellingPrice(
                                  (specificProduct?.selling_price || item.product?.srp).toString()
                                );
                              }}
                            >
                              Edit
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};