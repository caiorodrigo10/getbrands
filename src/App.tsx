import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { AppRoutes } from "./routes/AppRoutes";
import { useEffect } from "react";
import { trackPage } from "@/lib/analytics";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24, // 24 hours
      refetchOnWindowFocus: true,
      refetchOnMount: true,
      retry: 2,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
  },
});

const App = () => {
  useEffect(() => {
    // Ensure Segment is loaded
    if (!window.analytics) {
      console.error('Segment analytics not found. Please check the script installation.');
      return;
    }

    // Track initial page view
    trackPage({
      initial_load: true,
      timestamp: new Date().toISOString()
    });

    // Set up route change tracking
    const handleRouteChange = () => {
      trackPage({
        route_change: true,
        timestamp: new Date().toISOString()
      });
    };

    // Listen for route changes
    window.addEventListener('popstate', handleRouteChange);

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  return (
    <SessionContextProvider supabaseClient={supabase}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <AppRoutes />
                <Toaster />
                <Sonner />
              </TooltipProvider>
            </CartProvider>
          </AuthProvider>
        </BrowserRouter>
      </QueryClientProvider>
    </SessionContextProvider>
  );
};

export default App;