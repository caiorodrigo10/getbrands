import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
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
        .maybeSingle();
        
      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      
      return data;
    },
    enabled: !!user,
  });

  if (!activeProject) {
    return (
      <div className="p-4 bg-[#fff1ed] border-t border-[#f0562e]/20">
        <div className="space-y-3">
          <p className="text-sm text-gray-800">
            You don't have any points available. Schedule a call with our team to learn about our Packs!
          </p>
          <Button 
            className="w-full bg-[#f0562e] hover:bg-[#f0562e]/90 text-white"
            onClick={() => window.location.href = "https://calendly.com/your-team"}
          >
            Schedule a Call
          </Button>
        </div>
      </div>
    );
  }

  const availablePoints = activeProject.points - (activeProject.points_used || 0);

  return (
    <div className="p-4 bg-[#fff1ed] border-t border-[#f0562e]/20">
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-[#f0562e]">
          <Coins className="h-4 w-4" />
          <span className="text-sm font-medium">Available Points</span>
        </div>
        <p className="text-2xl font-bold text-gray-900">{availablePoints}</p>
        <p className="text-sm text-gray-600">
          Total: {activeProject.points} points
        </p>
      </div>
    </div>
  );
};