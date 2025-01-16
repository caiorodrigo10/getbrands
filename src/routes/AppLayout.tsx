import { Outlet, useLocation } from "react-router-dom";
import { NavigationMenu } from "@/components/NavigationMenu";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";

export const AppLayout = () => {
  const location = useLocation();
  
  // Só usar useOnboardingStatus se não estiver em rotas específicas
  const excludedPaths = ['/login', '/signup', '/onboarding', '/catalog', '/products'];
  if (!excludedPaths.some(path => location.pathname.startsWith(path))) {
    useOnboardingStatus();
  }

  // Don't show navigation menu for landing page, onboarding and auth pages
  const hideNav = ['/', '/login', '/signup', '/onboarding', '/forgot-password'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-background">
      {!hideNav && <NavigationMenu />}
      <main className={!hideNav ? "md:pl-64 w-full" : ""}>
        <div className="max-w-[1200px] mx-auto px-4 py-2 md:py-6 md:mt-0">
          <Outlet />
        </div>
      </main>
    </div>
  );
};