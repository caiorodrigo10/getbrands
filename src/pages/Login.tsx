import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const Login = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <div className="text-center mb-8">
          <img 
            src="https://content.app-sources.com/s/97257455971736356/uploads/Logos/Logotipo_4-7282325.png"
            alt="Mainer Logo"
            className="h-12 w-auto mx-auto mb-4"
          />
        </div>
        <Auth
          supabaseClient={supabase}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#4c1e6c',
                  brandAccent: '#6b2b99',
                }
              }
            }
          }}
          providers={[]}
          redirectTo={`${window.location.origin}/`}
        />
      </div>
    </div>
  );
};

export default Login;