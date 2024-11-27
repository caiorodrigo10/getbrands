import { useEffect } from "react";
import { trackPage } from "@/lib/analytics";

const Index = () => {
  useEffect(() => {
    // Track home page visit with correct parameter type
    trackPage("Home");
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