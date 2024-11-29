import { Outlet } from "react-router-dom";

export const MarketingLayout = () => {
  return (
    <div className="min-h-screen bg-background">
      <Outlet />
    </div>
  );
};