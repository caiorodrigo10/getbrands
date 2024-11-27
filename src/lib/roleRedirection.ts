export const getRoleBasedRedirectPath = (role?: string): string => {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'member':
      return '/dashboard';
    default:
      return '/dashboard';
  }
};