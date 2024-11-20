import { Outlet } from "react-router-dom";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";

export const AppLayout = () => {
  useOnboardingStatus();

  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
};