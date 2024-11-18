import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Coins } from "lucide-react";

export const ProjectPointsInfo = () => {
  const { user } = useAuth();

  const { data: activeProject } = useQuery({
    queryKey: ["active-project"],
    queryFn: async () => {
      if (!user) return null;
      
      const { data, error } = await supabase
        .from("projects")
        .select("*")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle(); // Changed from .single() to .maybeSingle()
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!user,
  });

  if (!activeProject) return null;

  const availablePoints = activeProject.points - (activeProject.points_used || 0);

  return (
    <div className="p-4 border-t border-border/40">
      <div className="space-y-3">
        <div className="space-y-1">
          <h4 className="text-sm font-medium text-gray-300">Active Project</h4>
          <p className="text-sm text-white truncate">{activeProject.name}</p>
        </div>
        
        <div className="flex items-center gap-2 text-sm">
          <Coins className="h-4 w-4 text-primary" />
          <span className="text-gray-300">Available Points:</span>
          <span className="font-medium text-white">{availablePoints}</span>
        </div>
      </div>
    </div>
  );
};