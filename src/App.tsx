import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation, useNavigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { AppRoutes } from "./routes/AppRoutes";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { debugAnalytics } from "./lib/analytics/debug";
import { trackPage, identifyUser } from "./lib/analytics";
import { Skeleton } from "./components/ui/skeleton";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

// Component to handle route changes
const RouteTracker = () => {
  const location = useLocation();

  useEffect(() => {
    trackPage({
      path: location.pathname,
      search: location.search,
      url: window.location.href
    });
  }, [location]);

  return null;
};

const AppContent = () => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          // Get user profile data
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profile) {
            // Identify user in Segment with complete profile data
            await identifyUser(session.user.id, {
              email: session.user.email,
              first_name: profile.first_name,
              last_name: profile.last_name,
              phone: profile.phone,
              role: profile.role,
              auth_provider: session.user.app_metadata.provider,
              last_sign_in: session.user.last_sign_in_at,
              onboarding_completed: profile.onboarding_completed,
              profile_type: profile.profile_type,
              brand_status: profile.brand_status
            });
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Get user profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profile) {
          await identifyUser(session.user.id, {
            email: session.user.email,
            first_name: profile.first_name,
            last_name: profile.last_name,
            phone: profile.phone,
            role: profile.role,
            auth_provider: session.user.app_metadata.provider,
            last_sign_in: session.user.last_sign_in_at,
            onboarding_completed: profile.onboarding_completed,
            profile_type: profile.profile_type,
            brand_status: profile.brand_status
          });
        }
      } else if (event === 'SIGNED_OUT') {
        navigate('/login');
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="space-y-4 w-full max-w-md">
          <Skeleton className="h-8 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-1/2 mx-auto" />
          <div className="space-y-2">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <RouteTracker />
      <AppRoutes />
      <Toaster />
      <Sonner />
    </>
  );
};

const App = () => {
  useEffect(() => {
    // Initialize debug mode
    debugAnalytics();
    // Track initial page view
    trackPage();
  }, []);

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <AppContent />
              </TooltipProvider>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

export default App;