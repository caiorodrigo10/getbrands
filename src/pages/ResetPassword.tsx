
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, useLocation } from "react-router-dom";

const ResetPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [tokenValid, setTokenValid] = useState(true);
  const [tokenChecked, setTokenChecked] = useState(false);

  // Check URL hash to extract token information
  useEffect(() => {
    const checkToken = async () => {
      const hash = location.hash;
      const urlParams = new URLSearchParams(hash.replace('#', ''));
      const accessToken = urlParams.get('access_token');
      const refreshToken = urlParams.get('refresh_token');
      const type = urlParams.get('type');

      // Check if we're coming from a recovery email with tokens
      if (accessToken && type === 'recovery') {
        try {
          // Set session from URL parameters
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || '',
          });

          if (error) throw error;

          if (data?.session) {
            setTokenValid(true);
            toast({
              title: "Ready to reset your password",
              description: "Please enter your new password below",
            });
          }
        } catch (error) {
          console.error("Token error:", error);
          setTokenValid(false);
          toast({
            variant: "destructive",
            title: "Invalid or expired reset link",
            description: "Please request a new password reset link",
          });
        }
      } else {
        // If there's no token in URL, check for active session
        const { data, error } = await supabase.auth.getSession();
        
        if (error || !data.session?.user) {
          console.error("Invalid reset session:", error);
          setTokenValid(false);
          toast({
            variant: "destructive",
            title: "Invalid or expired reset link",
            description: "Please request a new password reset link",
          });
        }
      }
      
      setTokenChecked(true);
    };

    checkToken();
  }, [location, toast]);

  const validatePassword = (password: string) => {
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long");
      return false;
    }
    setErrorMessage("");
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }
    
    if (!validatePassword(password)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      toast({
        title: "Password reset successful",
        description: "Your password has been reset. You can now log in with your new password.",
      });
      
      // Short delay before redirecting to login
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error: any) {
      console.error("Update password error:", error);
      toast({
        variant: "destructive",
        title: "Failed to reset password",
        description: error.message || "Please try again later.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Show loading state until token is checked
  if (!tokenChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-lg text-center">
          <div className="flex flex-col items-center space-y-4">
            <div className="w-10 h-10 border-2 border-[#f0562e] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-600">Verifying your reset link...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
        <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-lg">
          <div className="flex flex-col items-center space-y-2">
            <img
              src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
              alt="Logo"
              className="w-[180px] h-auto"
            />
            <h1 className="text-2xl font-semibold text-gray-900">
              Invalid Reset Link
            </h1>
            <p className="text-gray-600">
              This password reset link is invalid or has expired.
            </p>
          </div>

          <div className="mt-6 text-center">
            <Button
              className="bg-[#f0562e] hover:bg-[#f0562e]/90 text-white"
              onClick={() => navigate("/forgot-password")}
            >
              Request a new reset link
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <img
            src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
            alt="Logo"
            className="w-[180px] h-auto"
          />
          <h1 className="text-2xl font-semibold text-gray-900">
            Create new password
          </h1>
          <p className="text-gray-600">
            Please enter your new password
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                New password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  validatePassword(e.target.value);
                }}
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f0562e]/20"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm new password
              </label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f0562e]/20"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>
            
            {errorMessage && (
              <div className="text-red-500 text-sm">
                {errorMessage}
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-[#f0562e] hover:bg-[#f0562e]/90 text-white py-2.5 rounded-lg transition-all duration-200 font-medium"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>Resetting password...</span>
              </div>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
