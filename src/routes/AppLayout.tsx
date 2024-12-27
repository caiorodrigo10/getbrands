import { Outlet, useLocation } from "react-router-dom";
import { NavigationMenu } from "@/components/NavigationMenu";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";

export const AppLayout = () => {
  const location = useLocation();
  
  const excludedPaths = ['/login', '/signup', '/onboarding', '/catalog', '/products'];
  if (!excludedPaths.some(path => location.pathname.startsWith(path))) {
    useOnboardingStatus();
  }

  const hideNav = ['/login', '/signup', '/onboarding'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background flex">
      {!hideNav && <NavigationMenu />}
      <main className={`flex-1 ${!hideNav ? "md:ml-64" : ""}`}>
        <div className="max-w-[1200px] mx-auto px-4 py-2 md:py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};