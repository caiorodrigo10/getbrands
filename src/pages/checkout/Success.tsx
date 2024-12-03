import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { OrderConfirmationCard } from "@/components/checkout/success/OrderConfirmationCard";

const Success = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        const { error } = await supabase.auth.setSession({
          access_token: token,
          refresh_token: token,
        });

        if (error) {
          console.error('Error setting session:', error);
          navigate('/login');
          return;
        }
      }
    };

    initializeAuth();
  }, [token, navigate]);

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <OrderConfirmationCard />
      </div>
    </div>
  );
};

export default Success;