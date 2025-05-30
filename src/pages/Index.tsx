
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingBag, PenTool, Package2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  // This component is no longer used as the index page
  // since LandingPage.tsx is now rendering at the root path
  return null;
};

export default Index;
