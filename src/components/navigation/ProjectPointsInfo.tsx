import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Coins, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ProjectPointsInfo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: totalPoints } = useQuery({
    queryKey: ["total-project-points", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      const { data, error } = await supabase
        .from("projects")
        .select("points, points_used")
        .eq("user_id", user.id);
        
      if (error) throw error;
      
      return data.reduce((total, project) => {
        const availablePoints = (project.points || 0) - (project.points_used || 0);
        return total + availablePoints;
      }, 0);
    },
    enabled: !!user,
  });

  if (!totalPoints) return null;

  return (
    <div className="p-4 bg-[#fff4fc] border-t border-gray-200">
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-gray-900">
            <Coins className="h-4 w-4" />
            <span className="text-sm font-medium">Available Points</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{totalPoints}</p>
        </div>
        
        <Button 
          className="w-full bg-[#f0562e] hover:bg-[#f0562e]/90 text-white h-8 px-3"
          onClick={() => navigate("/catalog")}
        >
          <ShoppingBag className="h-4 w-4 mr-2" />
          View Catalog
        </Button>
      </div>
    </div>
  );
};