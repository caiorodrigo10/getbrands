export const getRoleBasedRedirectPath = (role: string | null, hasProjects: boolean = false): string => {
  if (!role) return '/login';
  
  if (role === 'admin') return '/admin/dashboard';
  if (hasProjects) return '/dashboard';
  if (['member', 'sampler'].includes(role)) return '/start-here';
  
  return '/dashboard';
};