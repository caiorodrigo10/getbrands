import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      const token = searchParams.get("token");
      
      if (!token) {
        toast({
          variant: "destructive",
          title: "Invalid Link",
          description: "This password reset link is invalid or has expired.",
        });
        navigate("/forgot-password");
        return;
      }

      try {
        // Decode the token
        const decodedToken = Buffer.from(token, 'base64').toString();
        const tokenDate = new Date(decodedToken);
        const now = new Date();
        
        // Check if token is expired (24 hours)
        if (now.getTime() - tokenDate.getTime() > 24 * 60 * 60 * 1000) {
          throw new Error("Token expired");
        }

        setIsTokenValid(true);
      } catch (error) {
        console.error("Token validation error:", error);
        toast({
          variant: "destructive",
          title: "Invalid Link",
          description: "This password reset link is invalid or has expired.",
        });
        navigate("/forgot-password");
      }
    };

    validateToken();
  }, [searchParams, navigate, toast]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!isTokenValid) {
      toast({
        variant: "destructive",
        title: "Invalid Link",
        description: "This password reset link is invalid or has expired.",
      });
      navigate("/forgot-password");
      return;
    }

    if (password !== confirmPassword) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Passwords do not match",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Password must be at least 6 characters long",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({ password });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Your password has been updated successfully.",
      });

      // Clear form and redirect to login
      setPassword("");
      setConfirmPassword("");
      navigate("/login");
    } catch (error: any) {
      console.error("Error updating password:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update password. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isTokenValid) {
    return null; // Don't render form while validating token
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <h2 className="text-2xl font-semibold">Reset Your Password</h2>
          <p className="text-gray-600">
            Please enter your new password below
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f0562e]/20"
                placeholder="New password"
                disabled={isLoading}
              />
            </div>
            <div>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f0562e]/20"
                placeholder="Confirm new password"
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
                <span>Updating...</span>
              </div>
            ) : (
              "Update Password"
            )}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;