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
      
      console.log("Fetching profile for user:", user.id); // Debug log
      
      const { data, error } = await supabase
        .from("profiles")
        .select("onboarding_completed")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error); // Debug log
        throw error;
      }
      
      console.log("Profile data:", data); // Debug log
      return data;
    },
    enabled: !!user?.id,
  });

  // Debug logs
  console.log("Current path:", location.pathname);
  console.log("Auth status:", { isAuthenticated, isLoading, profile });

  // Se ainda estiver carregando, mostrar loading
  if (isLoading || isLoadingProfile) {
    return <div>Loading...</div>;
  }

  // Lista de rotas que não precisam de onboarding
  const publicRoutes = ['/login', '/signup', '/onboarding', '/', '/policies', '/terms'];
  const isPublicRoute = publicRoutes.some(route => 
    location.pathname.endsWith(route) || 
    location.pathname === `/${i18n.language}`
  );

  // Se o usuário está autenticado mas não completou o onboarding
  // E não está em uma rota pública
  if (isAuthenticated && 
      profile && 
      profile.onboarding_completed === false && 
      !isPublicRoute) {
    console.log("Redirecting to onboarding - Profile:", profile); // Debug log
    return <Navigate to={`/${i18n.language}/onboarding`} replace />;
  }

  // Se não estiver autenticado e a rota requer autenticação
  if (!isAuthenticated && requiresAuth && !location.pathname.startsWith('/login')) {
    console.log("Redirecting to login"); // Debug log
    return <Navigate to={`/${i18n.language}/login`} state={{ from: location.pathname }} replace />;
  }

  // Se a rota requer admin e o usuário não tem acesso total
  if (requiresAdmin && !hasFullAccess) {
    console.log("No admin access"); // Debug log
    return <Navigate to={`/${i18n.language}/catalog`} replace />;
  }

  // Se é uma rota restrita e o usuário não tem acesso total
  if ((isRestrictedRoute(location.pathname) || location.pathname.includes('/dashboard')) && !hasFullAccess && !requiresAdmin) {
    console.log("Restricted route"); // Debug log
    return <Navigate to={`/${i18n.language}/start-here`} replace />;
  }

  return <>{children}</>;
};