import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

const StartHere = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("role, first_name")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (profile && !["member", "sampler"].includes(profile.role)) {
      navigate("/dashboard");
    }
  }, [profile, navigate]);

  // Add script for video player
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://scripts.converteai.net/lib/js/smartplayer/v1/sdk.min.js";
    script.setAttribute("data-id", "673f76196fbe5b000be3566d");
    script.async = true;
    document.head.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <h1 className="text-2xl md:text-4xl font-bold mb-8">Loading...</h1>
      </div>
    );
  }

  const welcomeMessage = profile?.first_name 
    ? `Welcome to GetBrands, ${profile.first_name}!` 
    : "Welcome to GetBrands!";

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-2xl md:text-4xl font-bold mb-8">
        {welcomeMessage}
      </h1>
      
      <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
      <p className="text-gray-600 mb-6">
        Welcome! Watch our quick intro video to learn how to make the most of our platform and start creating amazing products.
      </p>
      
      <div className="mb-8 rounded-xl overflow-hidden">
        <div id="ifr_673f76196fbe5b000be3566d_wrapper" style={{ margin: '0 auto', width: '100%' }}>
          <div style={{ padding: '56.25% 0 0 0', position: 'relative' }} id="ifr_673f76196fbe5b000be3566d_aspect">
            <iframe 
              frameBorder="0" 
              allowFullScreen 
              src="https://scripts.converteai.net/5719503f-d81c-468d-9d79-d4381d85c6da/players/673f76196fbe5b000be3566d/embed.html" 
              id="ifr_673f76196fbe5b000be3566d" 
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%'
              }}
              referrerPolicy="origin"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Link to="/catalog">
          <Button 
            className="w-full bg-[#f0562e] hover:bg-[#f0562e]/90 text-white"
            size="lg"
          >
            Explore Product Catalog
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        
        <Button 
          className="w-full"
          size="lg"
          variant="outline"
        >
          Schedule a Demo
          <ArrowRight className="ml-2 h-5 w-5" />
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-8">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Next Steps</h3>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-600">
              <span className="mr-2">1.</span>
              Complete your profile information
            </li>
            <li className="flex items-center text-gray-600">
              <span className="mr-2">2.</span>
              Browse our product catalog
            </li>
            <li className="flex items-center text-gray-600">
              <span className="mr-2">3.</span>
              Request product samples
            </li>
          </ul>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h3 className="text-xl font-semibold mb-4">Resources</h3>
          <ul className="space-y-3">
            <li className="flex items-center text-gray-600">
              <span className="mr-2">•</span>
              Platform Guide
            </li>
            <li className="flex items-center text-gray-600">
              <span className="mr-2">•</span>
              FAQ
            </li>
            <li className="flex items-center text-gray-600">
              <span className="mr-2">•</span>
              Support Contact
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default StartHere;
