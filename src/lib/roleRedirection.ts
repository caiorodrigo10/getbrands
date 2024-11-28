export const getRoleBasedRedirectPath = (role: string | null, hasProjects: boolean = false): string => {
  // Se não tiver role, vai para login
  if (!role) return '/login';
  
  // Mantém o usuário na página atual
  return window.location.pathname;
};