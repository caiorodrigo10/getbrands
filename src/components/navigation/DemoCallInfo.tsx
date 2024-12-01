import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { useState } from "react";

export const DemoCallInfo = () => {
  const [isScheduled, setIsScheduled] = useState(false);

  const handleScheduleClick = () => {
    setIsScheduled(true);
    // Later we'll add the actual scheduling logic
  };

  return (
    <div className="p-4 bg-[#fff1ed] border-t border-[#f0562e]/20">
      <div className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-[#f0562e]">
            <CalendarDays className="h-4 w-4" />
            <span className="text-sm font-medium">Schedule a Demo Call</span>
          </div>
          <p className="text-sm text-gray-600">
            {isScheduled 
              ? "Thanks! Our team will contact you soon to schedule the demo."
              : "Learn how to create your own brand with our team of experts."}
          </p>
        </div>
        
        <Button 
          className="w-full bg-[#f0562e] hover:bg-[#f0562e]/90 text-white h-8 px-3 py-1 text-sm"
          onClick={handleScheduleClick}
          disabled={isScheduled}
        >
          {isScheduled ? "Request Sent" : "Schedule Demo"}
        </Button>
      </div>
    </div>
  );
};