import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import AppRoutes from "./routes/AppRoutes";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useRef } from "react";
import { trackPage } from "./lib/analytics";

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
  const lastTrackedPath = useRef(location.pathname);

  useEffect(() => {
    // Só dispara o evento se o path mudou
    if (lastTrackedPath.current !== location.pathname) {
      // Agora o trackPage já inclui todos os dados necessários
      trackPage();
      lastTrackedPath.current = location.pathname;
    }
  }, [location]);

  return null;
};

const App = () => {
  return (
    <SessionContextProvider 
      supabaseClient={supabase} 
      initialSession={null}
    >
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <AuthProvider>
            <CartProvider>
              <TooltipProvider>
                <RouteTracker />
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