import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Password reset functionality will be implemented later
      toast({
        title: "Check your email",
        description: "If an account exists, you will receive a password reset link.",
      });
    } catch (error: any) {
      console.error("Password reset error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to send reset password email. Please try again.",
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
            Reset your password
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f0562e]/20"
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#f0562e] hover:bg-[#f0562e]/90 text-white py-2.5 rounded-lg transition-all duration-200 font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>Sending...</span>
              </div>
            ) : (
              "Send Reset Link"
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link to="/login" className="text-[#f0562e] hover:text-[#f0562e]/90">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;