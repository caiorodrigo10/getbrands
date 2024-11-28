import { Outlet, useLocation } from "react-router-dom";
import { NavigationMenu } from "@/components/NavigationMenu";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";

export const AppLayout = () => {
  const location = useLocation();
  useOnboardingStatus();

  // Don't show navigation menu for onboarding, auth pages and index
  const hideNav = [
    '/login', 
    '/signup', 
    '/onboarding',
    '/en',
    '/pt',
    '/es'
  ].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {!hideNav && <NavigationMenu />}
      <main className={!hideNav ? "md:pl-64 w-full" : ""}>
        <div className="max-w-[1200px] mx-auto px-4 py-6 mt-16 md:mt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};