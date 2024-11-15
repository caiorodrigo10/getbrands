import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Package } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";

interface ProductSelectionStageProps {
  projectProducts: any[];
  totalPoints: number;
  usedPoints: number;
  remainingPoints: number;
  progressPercentage: number;
}

export const ProductSelectionStage = ({
  projectProducts,
  totalPoints,
  usedPoints,
  remainingPoints,
  progressPercentage,
}: ProductSelectionStageProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground">
          {projectProducts?.length || 0} products selected
        </p>
        <Button onClick={() => navigate("/catalog")} variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Add Products
        </Button>
      </div>

      <Card className="p-4 bg-gray-50">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Project Points</span>
            <span className="text-sm font-medium">{remainingPoints} points remaining</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{usedPoints} used</span>
            <span>{totalPoints} total</span>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {projectProducts?.map((item) => (
          <Card key={item.id} className="p-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img 
                  src={item.product.image_url || "/placeholder.svg"} 
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-medium text-sm truncate">{item.product.name}</h4>
                <div className="flex items-center gap-2 text-muted-foreground mt-1">
                  <Package className="h-4 w-4" />
                  <span className="text-sm">Product</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};