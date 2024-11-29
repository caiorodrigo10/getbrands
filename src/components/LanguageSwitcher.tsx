import { useTranslation } from 'react-i18next';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const { user } = useAuth();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'pt', name: 'Português' },
    { code: 'es', name: 'Español' }
  ];

  const handleLanguageChange = async (value: string) => {
    try {
      // Change language in i18next
      await i18n.changeLanguage(value);

      // If user is logged in, save preference to profile
      if (user?.id) {
        const { error } = await supabase
          .from('profiles')
          .upsert({ 
            id: user.id,
            language: value,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id);

        if (error) throw error;
        
        toast.success('Language preference saved');
      }
    } catch (error) {
      console.error('Error saving language preference:', error);
      toast.error('Failed to save language preference');
    }
  };

  return (
    <Select value={i18n.language} onValueChange={handleLanguageChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select language" />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};