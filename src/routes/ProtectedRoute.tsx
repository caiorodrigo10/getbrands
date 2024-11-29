import { Navigate, useLocation } from "react-router-dom";
import { isRestrictedRoute } from "@/lib/permissions";
import { useAuthWithPermissions } from "@/hooks/useAuthWithPermissions";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requiresAuth = true,
  requiresAdmin = false,
}: ProtectedRouteProps) => {
  const { 
    isAuthenticated, 
    isLoading,
    hasFullAccess,
    user
  } = useAuthWithPermissions();
  
  const location = useLocation();
  const { i18n } = useTranslation();

  const { data: profile, isLoading: isLoadingProfile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  console.log('[DEBUG] ProtectedRoute - Path:', location.pathname, 'Auth:', isAuthenticated, 'Loading:', isLoading, 'Admin:', hasFullAccess);

  // Se ainda estiver carregando, mostrar loading
  if (isLoading || isLoadingProfile) {
    return <div>Loading...</div>;
  }

  // Se não estiver autenticado e a rota requer autenticação
  if (!isAuthenticated && requiresAuth && !location.pathname.startsWith('/login')) {
    console.log('[DEBUG] ProtectedRoute - Redirecting to login');
    return <Navigate to={`/${i18n.language}/login`} state={{ from: location.pathname }} replace />;
  }

  // Se a rota requer admin e o usuário não tem acesso total
  if (requiresAdmin && !hasFullAccess) {
    console.log('[DEBUG] ProtectedRoute - No admin access');
    return <Navigate to={`/${i18n.language}/catalog`} replace />;
  }

  // Se o usuário está autenticado mas não completou o onboarding
  // E não está na página de onboarding
  if (isAuthenticated && 
      !profile?.onboarding_completed && 
      !location.pathname.includes('/onboarding') &&
      !location.pathname.includes('/login') &&
      !location.pathname.includes('/signup')) {
    console.log('[DEBUG] ProtectedRoute - Redirecting to onboarding');
    return <Navigate to={`/${i18n.language}/onboarding`} replace />;
  }

  // Se é uma rota restrita e o usuário não tem acesso total
  if ((isRestrictedRoute(location.pathname) || location.pathname.includes('/dashboard')) && !hasFullAccess && !requiresAdmin) {
    console.log('[DEBUG] ProtectedRoute - Restricted route');
    return <Navigate to={`/${i18n.language}/start-here`} replace />;
  }

  return <>{children}</>;
};