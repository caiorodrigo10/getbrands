
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Coins, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ProjectPointsInfo = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: totalPoints, isLoading } = useQuery({
    queryKey: ["total-project-points", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      try {
        console.log("Fetching points for user:", user?.id);
        const { data, error } = await supabase
          .from("projects")
          .select("*") // Select all columns to see complete project data
          .eq("user_id", user.id);
          
        if (error) {
          console.error("Error fetching project points:", error);
          return 0;
        }
        
        if (!data || data.length === 0) {
          console.log("No projects found for user:", user.id);
          return 0;
        }
        
        console.log("Projects data:", data);
        
        return data.reduce((total, project) => {
          const availablePoints = (project.points || 0) - (project.points_used || 0);
          console.log(`Project ${project.id}: ${project.points} points, ${project.points_used} used, ${availablePoints} available`);
          return total + availablePoints;
        }, 0);
      } catch (err) {
        console.error("Unexpected error fetching points:", err);
        return 0;
      }
    },
    enabled: !!user?.id,
  });

  console.log("ProjectPointsInfo - totalPoints:", totalPoints, "isLoading:", isLoading);

  return (
    <div className="p-4 bg-[#fff1ed] border-t border-[#f0562e]/20">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#f0562e]">
            <Coins className="h-4 w-4" />
            <span className="text-sm font-medium">Available Points</span>
          </div>
          <p className="text-2xl font-bold text-gray-900">{isLoading ? "..." : totalPoints}</p>
        </div>
        
        <Button 
          className="w-full bg-[#f0562e] hover:bg-[#f0562e]/90 text-white h-8 px-3 py-1 text-sm"
          onClick={() => navigate("/catalog")}
        >
          <ShoppingBag className="h-3.5 w-3.5 mr-2" />
          View Catalog
        </Button>
      </div>
    </div>
  );
};
