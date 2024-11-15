import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export const CalendarStage = () => {
  useEffect(() => {
    (async function () {
      try {
        const cal = await getCalApi();
        if (cal) {
          cal("ui", {
            theme: "light",
            styles: { branding: { brandColor: "#4c1e6c" } },
            hideEventTypeDetails: false,
          });
        }
      } catch (error) {
        console.error("Error initializing Cal:", error);
      }
    })();
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Schedule a call with our team:</p>
      <div className="h-[600px] w-full">
        <Cal
          calLink="caio-apfelbaum/cafe-com-caio"
          style={{ width: "100%", height: "100%" }}
          config={{
            layout: "month_view",
          }}
        />
      </div>
    </div>
  );
};