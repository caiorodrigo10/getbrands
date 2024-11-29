import { useState } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";
import { trackEvent } from "@/lib/analytics";
import { toast } from "sonner";

const SignUp = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const currentLanguage = lang || 'en';

      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            language: currentLanguage,
          },
        },
      });

      if (error) throw error;

      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            first_name: formData.firstName,
            last_name: formData.lastName,
            language: currentLanguage,
          })
          .eq('id', data.user.id);

        if (profileError) throw profileError;

        trackEvent('user_signed_up', {
          userId: data.user.id,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          language: currentLanguage,
        });

        navigate(`/${currentLanguage}/onboarding`);
        toast.success(t('messages.accountCreated'));
      }
    } catch (error: any) {
      console.error("Error signing up:", error);
      toast.error(error.message || t('messages.signupError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <img
            src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
            alt="Logo"
            className="w-[180px] h-auto"
          />
          <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            {t('auth.createAccount')}
          </h2>
          <p className="text-gray-600">
            {t('auth.joinUs')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              name="firstName"
              type="text"
              value={formData.firstName}
              onChange={handleChange}
              placeholder={t('auth.firstName')}
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f0562e]/20"
              disabled={isLoading}
            />
            <Input
              name="lastName"
              type="text"
              value={formData.lastName}
              onChange={handleChange}
              placeholder={t('auth.lastName')}
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f0562e]/20"
              disabled={isLoading}
            />
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder={t('auth.emailPlaceholder')}
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f0562e]/20"
              disabled={isLoading}
            />
            <Input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder={t('auth.passwordPlaceholder')}
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f0562e]/20"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#f0562e] hover:bg-[#f0562e]/90 text-white py-2.5 rounded-lg transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
          </Button>

          <p className="text-center text-sm text-gray-600">
            {t('auth.alreadyHaveAccount')}{' '}
            <Link to={`/${lang || 'en'}/login`} className="text-[#f0562e] hover:text-[#f0562e]/90 font-medium">
              {t('auth.signIn')}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default SignUp;