import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { supabase } from '@/integrations/supabase/client';

// Function to extract language from URL
const getLanguageFromURL = () => {
  if (typeof window === 'undefined') return 'en';
  
  const path = window.location.pathname;
  const firstSegment = path.split('/')[1];
  const supportedLanguages = ['en', 'pt', 'es'];
  
  return supportedLanguages.includes(firstSegment) ? firstSegment : 'en';
};

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: ['en'],
    supportedLngs: ['en', 'pt', 'es'],
    debug: import.meta.env.DEV,
    
    backend: {
      loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    
    detection: {
      order: ['path', 'localStorage', 'navigator'],
      lookupFromPathIndex: 0,
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false,
    },

    ns: ['common', 'auth', 'dashboard'],
    defaultNS: 'common',
  });

// Custom language detector for user profile and URL
const getUserLanguage = async () => {
  try {
    // First check URL
    const urlLanguage = getLanguageFromURL();
    if (urlLanguage) {
      i18n.changeLanguage(urlLanguage);
      return;
    }

    // Then check user profile if logged in
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('language')
        .eq('id', user.id)
        .single();
      
      if (!error && profile?.language) {
        i18n.changeLanguage(profile.language);
        return;
      }
    }

    // Fallback to browser language or default
    const browserLang = navigator.language.split('-')[0];
    const supportedLangs = ['en', 'pt', 'es'];
    const defaultLang = supportedLangs.includes(browserLang) ? browserLang : 'en';
    i18n.changeLanguage(defaultLang);

  } catch (error) {
    console.error('Error fetching user language preference:', error);
    i18n.changeLanguage('en'); // Fallback to English on error
  }
};

getUserLanguage();

export default i18n;