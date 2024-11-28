import { Navigate, useLocation } from "react-router-dom";
import { getCurrentLanguage, isValidLanguage } from "@/lib/language";

export const LanguageRoute = () => {
  const location = useLocation();
  const path = location.pathname;
  const firstSegment = path.split('/')[1];
  
  // If we're at root, redirect to current language
  if (path === '/') {
    return <Navigate to={`/${getCurrentLanguage()}`} replace />;
  }

  // If the first segment is not a valid language code, prefix with current language
  if (!isValidLanguage(firstSegment)) {
    const currentLang = getCurrentLanguage();
    const newPath = `/${currentLang}${path === '/' ? '' : path}`;
    return <Navigate to={newPath} replace />;
  }

  return null;
};