import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { SignUpFormFields } from "@/components/auth/signup/SignUpFormFields";
import { trackEvent } from "@/lib/analytics";
import { useTranslation } from "react-i18next";
import { getCurrentLanguage, isValidLanguage } from "@/lib/language";

const SignUp = () => {
  const navigate = useNavigate();
  const { lang } = useParams();
  const { t, i18n } = useTranslation();
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

  const currentLanguage = isValidLanguage(lang) ? lang : getCurrentLanguage();

  const validateForm = () => {
    const newErrors = {
      password: "",
      phone: "",
    };
    let isValid = true;

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
      isValid = false;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      isValid = false;
      toast.error("Please fill in all fields");
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
      // Signup with Supabase
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (authData.user) {
        // Track signup event
        trackEvent("User Signed Up", {
          userId: authData.user.id,
        });

        // Immediately redirect to onboarding
        navigate(`/${currentLanguage}/onboarding`, { replace: true });
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
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {t("auth.signup.title")}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {t("auth.signup.description")}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <SignUpFormFields
            formData={formData}
            setFormData={setFormData}
            errors={errors}
          />

          <div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? t("common.loading") : t("auth.signup.submit")}
            </Button>
          </div>

          <div className="text-sm text-center">
            <Link
              to={`/${currentLanguage}/login`}
              className="font-medium text-primary hover:text-primary/80"
            >
              {t("auth.signup.loginLink")}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;