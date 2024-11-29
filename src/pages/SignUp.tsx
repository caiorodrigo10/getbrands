import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { SignUpFormFields } from "@/components/auth/signup/SignUpFormFields";
import { trackEvent } from "@/lib/analytics";
import { useTranslation } from "react-i18next";

const SignUp = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    phone: "",
  });

  const validateForm = () => {
    const newErrors = {
      password: "",
      phone: "",
    };
    let isValid = true;

    if (formData.password.length < 6) {
      newErrors.password = t("auth.errors.passwordLength");
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = t("auth.errors.phoneRequired");
      isValid = false;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      isValid = false;
      toast.error(t("auth.errors.allFieldsRequired"));
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: 'member',
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data?.user) {
        trackEvent('user_signed_up', {
          userId: data.user.id,
          email: formData.email,
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          signupMethod: 'email',
        });

        navigate("/onboarding");
        toast.success(t("messages.signupSuccess"));
      }
    } catch (error: any) {
      console.error("Signup error:", error);
      toast.error(error.message || t("messages.error"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-full max-w-md space-y-8 p-8">
        <div className="flex flex-col items-center space-y-4">
          <img
            src="/lovable-uploads/708f603e-bfa9-4f6f-9a63-ccdb46c6329f.png"
            alt="getbrands"
            className="h-8"
          />
          <h2 className="text-2xl font-semibold text-gray-900">
            {t('auth.createAccount')}
          </h2>
          <p className="text-gray-600 text-center">
            {t('auth.joinUs')}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <SignUpFormFields 
            formData={formData}
            errors={errors}
            setFormData={setFormData}
          />

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white font-medium rounded-full"
            disabled={isLoading}
          >
            {isLoading ? t('auth.creatingAccount') : t('auth.createAccount')}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">{t('auth.alreadyHaveAccount')}</span>{" "}
            <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
              {t('auth.signIn')}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;