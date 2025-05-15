
import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Video } from "lucide-react";
import { trackEvent } from "@/lib/analytics";
import { startHereMessages } from "@/lib/i18n/messages";

interface StartHerePageProps {
  language: "en" | "pt";
}

export const StartHerePage = ({ language }: StartHerePageProps) => {
  const { user } = useAuth();
  const hasTrackedView = useRef(false);
  const messages = startHereMessages[language];
  
  // Track page view with UTM data
  useEffect(() => {
    if (user && !hasTrackedView.current) {
      trackEvent('onboarding_welcome_viewed', {
        language,
        userId: user.id,
      });
      
      // For Facebook Pixel tracking
      if (window.fbq) {
        window.fbq('trackCustom', 'OnboardingCompleted', {
          language,
        });
      }
      
      hasTrackedView.current = true;
    }
  }, [user, language]);

  // Load user profile data
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

  // Load video player script
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
      <div className="max-w-3xl mx-auto py-8 px-4 sm:py-12 sm:px-6">
        <h1 className="text-2xl md:text-4xl font-bold mb-8">{messages.loading}</h1>
      </div>
    );
  }

  const welcomeMessage = profile?.first_name 
    ? messages.welcomeWithName.replace('{name}', profile.first_name)
    : messages.welcome;

  const catalogPath = language === 'pt' ? '/catalog?lang=pt' : '/catalog';
  const schedulePath = language === 'pt' ? '/schedule-demo?lang=pt' : '/schedule-demo';

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 sm:py-12 sm:px-6">
      <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8">
        {welcomeMessage}
      </h1>
      
      <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4">{messages.gettingStarted}</h2>
      <p className="text-gray-600 mb-6">
        {messages.welcomeText}
      </p>
      
      <div className="mb-8 rounded-xl overflow-hidden shadow-lg">
        <div id="ifr_673f76196fbe5b000be3566d_wrapper" className="w-full mx-auto">
          <div className="relative aspect-video">
            <iframe 
              frameBorder="0" 
              allowFullScreen 
              src="https://scripts.converteai.net/5719503f-d81c-468d-9d79-d4381d85c6da/players/673f76196fbe5b000be3566d/embed.html" 
              id="ifr_673f76196fbe5b000be3566d" 
              className="absolute inset-0 w-full h-full"
              referrerPolicy="origin"
              title="Welcome video"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2">
        <Link to={catalogPath}>
          <Button 
            className="w-full bg-[#f0562e] hover:bg-[#f0562e]/90 text-white"
            size="lg"
          >
            {messages.exploreCatalog}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </Link>
        <Link to={schedulePath}>
          <Button 
            className="w-full border-2 border-[#f0562e] text-[#f0562e] hover:bg-[#f0562e]/10 bg-transparent"
            size="lg"
          >
            {messages.scheduleMeeting}
            <Video className="ml-2 h-5 w-5" />
          </Button>
        </Link>
      </div>
    </div>
  );
};
