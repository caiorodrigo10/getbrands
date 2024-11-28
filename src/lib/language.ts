import i18n from '@/lib/i18n';

export const supportedLanguages = ['en', 'pt', 'es'];

export const getDefaultLanguage = () => {
  const browserLang = navigator.language.split('-')[0];
  return supportedLanguages.includes(browserLang) ? browserLang : 'en';
};

export const isValidLanguage = (lang?: string) => {
  return lang && supportedLanguages.includes(lang);
};

export const getCurrentLanguage = () => {
  return i18n.language || getDefaultLanguage();
};

export const getLanguagePrefix = (path: string) => {
  const match = path.match(/^\/(en|pt|es)/);
  return match ? match[0] : `/${getCurrentLanguage()}`;
};