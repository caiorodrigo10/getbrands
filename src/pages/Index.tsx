import { useEffect } from "react";
import { trackPage } from "@/lib/analytics";

const Index = () => {
  useEffect(() => {
    trackPage({
      initial_load: true,
      route_change: false,
      url: window.location.href,
      referrer: document.referrer,
      session_id: "session-1", // You should implement proper session ID generation
      user_role: "member",
      page_type: "home"
    });
  }, []);

  return (
    <div className="space-y-6">
      <h1>Welcome to Mainer Portal</h1>
      <div className="grid gap-6">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4">Overview</h2>
          <div className="space-y-4">
            <p className="text-muted-foreground">
              Access your projects, products, and documents in one place.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;