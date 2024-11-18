import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const StartHere = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
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

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-8">Welcome to Mainer!</h1>
      
      <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Getting Started</h2>
        <p className="text-gray-600 mb-6">
          Welcome to our platform! We're excited to help you start your journey in creating amazing products.
          Watch our introduction video below to learn more about how to make the most of our platform.
        </p>
        
        <div className="aspect-w-16 aspect-h-9 mb-6">
          <iframe
            className="w-full h-[400px] rounded-lg"
            src="https://www.youtube.com/embed/your-video-id"
            title="Welcome to Mainer"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
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