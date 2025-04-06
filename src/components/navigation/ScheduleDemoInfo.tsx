
import { useNavigate } from "react-router-dom";
import { Video } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ScheduleDemoInfo = () => {
  const navigate = useNavigate();

  // Log adicionado para depuração
  console.log("ScheduleDemoInfo component rendering");

  return (
    <div className="p-4 bg-[#fff1ed] border-t border-[#f0562e]/20">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#f0562e]">
            <Video className="h-4 w-4" />
            <span className="text-sm font-medium">Schedule a Demo Call</span>
          </div>
          <p className="text-sm text-gray-600">Get personalized guidance and learn how to make the most of our platform.</p>
        </div>
        
        <Button 
          className="w-full bg-[#f0562e] hover:bg-[#f0562e]/90 text-white h-8 px-3 py-1 text-sm"
          onClick={() => navigate("/schedule-demo")}
        >
          <Video className="h-3.5 w-3.5 mr-2" />
          Schedule Now
        </Button>
      </div>
    </div>
  );
};
