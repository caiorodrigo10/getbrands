import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { OTPInput } from "@/components/auth/OTPInput";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

const Login = () => {
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("[DEBUG] Login - Sending OTP request for email:", email);

    try {
      const response = await fetch(
        'https://skrvprmnncxpkojraoem.supabase.co/functions/v1/handle-otp',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email,
            type: 'login'
          }),
        }
      );

      const data = await response.json();
      console.log("[DEBUG] Login - OTP response:", data);
      
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');

      setShowOTP(true);
      toast({
        title: "Success",
        description: "Check your email for the magic link",
      });

      trackEvent("OTP Sent", {
        email: email,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.error("[ERROR] Login - OTP request failed:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to send OTP",
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
            Transform your ideas into amazing products
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSendOTP}>
          <div className="space-y-4">
            <div>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f0562e]/20"
                placeholder="your@email.com"
                disabled={isLoading || showOTP}
              />
            </div>

            {showOTP && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Check your email for the magic link
                </label>
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#f0562e] hover:bg-[#f0562e]/90 text-white py-2.5 rounded-lg transition-all duration-200 font-medium"
            disabled={isLoading || showOTP}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>Sending...</span>
              </div>
            ) : showOTP ? (
              "Check your email"
            ) : (
              "Send Magic Link"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link to="/signup" className="text-[#f0562e] hover:text-[#f0562e]/90">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;