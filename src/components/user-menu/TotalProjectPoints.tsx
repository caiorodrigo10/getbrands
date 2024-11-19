import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Coins } from "lucide-react";

export const TotalProjectPoints = () => {
  const { user } = useAuth();

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
    <div className="px-4 py-2 border-t border-gray-200">
      <div className="flex items-center gap-2 text-gray-600">
        <Coins className="h-4 w-4" />
        <span className="text-sm">Total Available Points:</span>
        <span className="text-sm font-medium">{totalPoints}</span>
      </div>
    </div>
  );
};