import Cal, { getCalApi } from "@calcom/embed-react";
import { useEffect } from "react";

export const CalendarStage = () => {
  useEffect(() => {
    (async function () {
      const cal = await getCalApi();
      cal("ui", {
        theme: "light",
        styles: { branding: { brandColor: "#4c1e6c" } },
      });
    })();
  }, []);

  return (
    <div className="space-y-4">
      <p className="text-muted-foreground">Schedule a call with our team:</p>
      <Cal
        calLink="caio-apfelbaum/cafe-com-caio"
        style={{ width: "100%", height: "100%", minHeight: "500px" }}
        config={{
          layout: "month_view",
          hideEventTypeDetails: false,
        }}
      />
    </div>
  );
};