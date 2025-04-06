
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Coins } from "lucide-react";
import { useUserPermissions } from "@/lib/permissions";

export const TotalProjectPoints = () => {
  const { user } = useAuth();
  const { isAdmin } = useUserPermissions();

  const { data: totalPoints } = useQuery({
    queryKey: ["total-project-points", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      
      try {
        // For admin users, show a fixed sample value
        if (isAdmin) {
          return 2000; // Sample points for admin
        }
        
        const { data, error } = await supabase
          .from("projects")
          .select("points, points_used")
          .eq("user_id", user.id);
          
        if (error) throw error;
        
        return data.reduce((total, project) => {
          const availablePoints = (project.points || 0) - (project.points_used || 0);
          return total + availablePoints;
        }, 0);
      } catch (err) {
        console.error("Error fetching project points:", err);
        return 0;
      }
    },
    enabled: !!user,
  });

  if (totalPoints === undefined) return null;

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
