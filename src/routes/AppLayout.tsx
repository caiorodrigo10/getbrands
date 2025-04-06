
import { Outlet, useLocation } from "react-router-dom";
import { NavigationMenu } from "@/components/NavigationMenu";
import { useOnboardingStatus } from "@/hooks/useOnboardingStatus";
import { useAuth } from "@/contexts/AuthContext";
import { CartProvider } from "@/contexts/CartContext";

export const AppLayout = () => {
  const location = useLocation();
  const { user } = useAuth();
  
  // Create a more comprehensive exclusion list for onboarding check
  const excludedPaths = [
    '/login', 
    '/signup', 
    '/onboarding', 
    '/catalog', 
    '/products',
    '/pt/onboarding',
    '/pt/signup',
    '/forgot-password',
    '/reset-password'
  ];
  
  // Only check onboarding when we have a user and not on excluded paths
  const shouldCheckOnboarding = 
    !!user && 
    !excludedPaths.some(path => location.pathname.startsWith(path));
  
  // Always call the hook, but pass a flag to control its behavior
  useOnboardingStatus(shouldCheckOnboarding);

  // Don't show navigation menu for onboarding and auth pages
  const hideNav = ['/login', '/signup', '/onboarding', '/pt/onboarding', '/pt/signup'].includes(location.pathname);

  // Skip wrapping with CartProvider on checkout routes as they already have their own CartProvider
  const isCheckoutRoute = location.pathname.startsWith('/checkout');

  return (
    <div className="min-h-screen bg-background">
      {!hideNav && <NavigationMenu />}
      <main className={!hideNav ? "md:pl-64 w-full" : ""}>
        <div className="max-w-[1200px] mx-auto px-4 py-2 md:py-6 md:mt-0">
          {isCheckoutRoute ? (
            <Outlet />
          ) : (
            <CartProvider>
              <Outlet />
            </CartProvider>
          )}
        </div>
      </main>
    </div>
  );
};
