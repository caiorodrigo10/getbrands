import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, useLocation, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { AppRoutes } from "./routes/AppRoutes";
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";
import { debugAnalytics } from "./lib/analytics/debug";
import { trackPage } from "./lib/analytics";
import { useTranslation } from "react-i18next";

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

// Component to handle route changes and language
const RouteTracker = () => {
  const location = useLocation();
  const { i18n } = useTranslation();

  useEffect(() => {
    // Track page view
    trackPage({
      path: location.pathname,
      search: location.search,
      url: window.location.href
    });

    // Handle language from URL
    const path = location.pathname;
    const firstSegment = path.split('/')[1];
    const supportedLanguages = ['en', 'pt', 'es'];
    
    // Only change language if it's different from current
    if (supportedLanguages.includes(firstSegment) && firstSegment !== i18n.language) {
      i18n.changeLanguage(firstSegment);
    }
  }, [location, i18n]);

  return null;
};

// Language redirect component
const LanguageRedirect = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const path = location.pathname;
  const firstSegment = path.split('/')[1];
  const supportedLanguages = ['en', 'pt', 'es'];

  // If the first segment is not a supported language, redirect with language prefix
  if (!supportedLanguages.includes(firstSegment)) {
    const newPath = `/${i18n.language}${path === '/' ? '' : path}`;
    return <Navigate to={newPath} replace />;
  }

  return null;
};

const App = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    debugAnalytics();
    trackPage();

    // Set initial language based on URL or browser preference
    const path = window.location.pathname;
    const firstSegment = path.split('/')[1];
    const supportedLanguages = ['en', 'pt', 'es'];
    
    if (supportedLanguages.includes(firstSegment)) {
      i18n.changeLanguage(firstSegment);
    }
  }, [i18n]);

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
                <LanguageRedirect />
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