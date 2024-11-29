import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const Login = () => {
  const { toast } = useToast();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const { lang } = useParams();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(`/${lang || i18n.language}/dashboard`);
    }
    
    // Update language if URL param differs from current
    if (lang && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [isAuthenticated, navigate, lang, i18n]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate(`/${lang || i18n.language}/catalog`);
    } catch (error: any) {
      console.error("Login error:", error);
      toast({
        variant: "destructive",
        title: t('auth.loginError'),
        description: t('auth.loginErrorMessage'),
      });
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
          <p className="text-gray-600">
            {t('auth.loginSubtitle')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f0562e]/20"
                placeholder={t('auth.emailPlaceholder')}
                disabled={isLoading}
              />
            </div>
            <div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f0562e]/20"
                placeholder={t('auth.passwordPlaceholder')}
                disabled={isLoading}
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full bg-[#f0562e] hover:bg-[#f0562e]/90 text-white py-2.5 rounded-lg transition-all duration-200 font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>{t('auth.signingIn')}</span>
              </div>
            ) : (
              t('auth.login')
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link to={`/${lang || i18n.language}/forgot-password`} className="text-[#f0562e] hover:text-[#f0562e]/90">
            {t('auth.forgotPassword')}
          </Link>
          <span className="mx-2 text-gray-400">•</span>
          <Link to={`/${lang || i18n.language}/signup`} className="text-[#f0562e] hover:text-[#f0562e]/90">
            {t('auth.createAccount')}
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;