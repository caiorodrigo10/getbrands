
import { useAuthWithPermissions } from "@/hooks/useAuthWithPermissions";

/**
 * Um hook utilitário que fornece permissões de usuário
 * Este é um wrapper em torno do useAuthWithPermissions para padronizar verificações de permissão
 */
export const useUserPermissions = () => {
  const auth = useAuthWithPermissions();
  
  console.log("useUserPermissions - permissões:", { 
    isAdmin: auth.isAdmin,
    hasFullAccess: auth.hasFullAccess,
    profile: auth.profile
  });
  
  return {
    ...auth,
    // Funções auxiliares para verificações comuns
    canAccessAdmin: () => auth.isAdmin,
    canAccessProjects: () => auth.hasFullAccess,
    canAccessDashboard: () => auth.hasFullAccess
  };
};

/**
 * Obtém o papel do usuário a partir do perfil
 * Util para componentes que não são React
 */
export const getUserRole = (profile: any) => {
  if (!profile) return null;
  return profile.role;
};
