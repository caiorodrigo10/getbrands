import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';
import { supabase } from '@/integrations/supabase/client';

i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
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

// Custom language detector for user profile
const getUserLanguage = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (user?.id) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('language')
        .eq('id', user.id)
        .single();
      
      if (!error && profile?.language) {
        i18n.changeLanguage(profile.language);
      }
    }
  } catch (error) {
    console.error('Error fetching user language preference:', error);
  }
};

getUserLanguage();

export default i18n;