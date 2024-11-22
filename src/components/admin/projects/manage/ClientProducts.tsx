import { Card } from "@/components/ui/card";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Pencil, Plus, Minus, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface ClientProductsProps {
  projectId: string;
}

export const ClientProducts = ({ projectId }: ClientProductsProps) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isPointsExpanded, setIsPointsExpanded] = useState(false);
  
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

  const handlePointsChange = async (amount: number) => {
    if (!projectDetails) return;
    
    const newPoints = (projectDetails.points || 0) + amount;
    
    if (newPoints < 0) {
      toast.error("Points cannot be negative");
      return;
    }

    try {
      const { error } = await supabase
        .from('projects')
        .update({ points: newPoints })
        .eq('id', projectId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["project-details", projectId] });
      toast.success(`Points ${amount > 0 ? 'added' : 'removed'} successfully`);
    } catch (error) {
      console.error('Error updating points:', error);
      toast.error("Failed to update points");
    }
  };

  const handleEditProduct = (projectProductId: string) => {
    navigate(`/admin/projects/${projectId}/products/${projectProductId}`);
  };

  if (!projectDetails?.project_products?.length) {
    return (
      <Card className="p-4">
        <p className="text-muted-foreground">No products selected yet.</p>
      </Card>
    );
  }

  const totalPoints = projectDetails?.points || 0;
  const usedPoints = projectDetails?.points_used || 0;
  const remainingPoints = totalPoints - usedPoints;
  const progressPercentage = (usedPoints / totalPoints) * 100;

  return (
    <Card className="p-4">
      <div className="space-y-4">
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="w-full flex justify-between items-center mb-2"
            onClick={() => setIsPointsExpanded(!isPointsExpanded)}
          >
            <span>Project Points Management</span>
            {isPointsExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          
          {isPointsExpanded && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-2 flex-1 mr-4">
                  <div className="flex justify-between text-sm text-muted-foreground mb-2">
                    <span>Project Points Usage</span>
                    <span>{remainingPoints} points remaining</span>
                  </div>
                  <Progress value={progressPercentage} className="h-2" />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>{usedPoints} used</span>
                    <span>{totalPoints} total</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePointsChange(-1000)}
                    disabled={!projectDetails?.points || projectDetails.points < 1000}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePointsChange(1000)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="grid gap-3">
          {projectDetails.project_products.map((item) => {
            const specificProduct = item.specific?.[0];
            const displayName = specificProduct?.name || item.product?.name;
            const displayImage = specificProduct?.main_image_url || item.product?.image_url;

            return (
              <div key={item.id} className="flex items-center gap-3 p-3 border rounded-lg bg-white hover:bg-gray-50">
                <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src={displayImage || "/placeholder.svg"}
                    alt={displayName}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{displayName}</h3>
                  <p className="text-sm text-muted-foreground">{item.product?.category}</p>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm">
                      <span className="text-muted-foreground">Cost: </span>
                      <span className="font-medium">${item.product?.from_price}</span>
                    </span>
                    <span className="text-sm">
                      <span className="text-muted-foreground">Selling: </span>
                      <span className="font-medium">${specificProduct?.selling_price || item.product?.srp}</span>
                    </span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleEditProduct(item.id)}
                  className="flex-shrink-0"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </Card>
  );
};