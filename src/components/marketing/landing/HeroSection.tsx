import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

export const HeroSection = () => {
  const [scriptError, setScriptError] = useState(false);

  useEffect(() => {
    const initializePlayer = () => {
      const videoContainer = document.getElementById("vid_673f63f57558ba000b569976");
      
      if (videoContainer) {
        // Remove any existing script to prevent duplicates
        const existingScript = document.getElementById("scr_673f63f57558ba000b569976");
        if (existingScript) {
          existingScript.remove();
        }

        // Create and append the new script with error handling
        const script = document.createElement("script");
        script.src = "https://scripts.converteai.net/5719503f-d81c-468d-9d79-d4381d85c6da/players/673f63f57558ba000b569976/player.js";
        script.async = true;
        script.id = "scr_673f63f57558ba000b569976";
        script.crossOrigin = "anonymous"; // Add CORS header
        
        // Error handling for script loading
        script.onerror = () => {
          console.error("Error loading video player script");
          setScriptError(true);
        };

        // Only append script once container is ready
        document.body.appendChild(script);
      }
    };

    // Add global error handler for the video player
    window.onerror = (message, source, lineno, colno, error) => {
      if (source?.includes('converteai.net')) {
        console.error('Video player error:', message);
        setScriptError(true);
        return true; // Prevent the error from bubbling up
      }
      return false;
    };

    // Initial attempt to initialize
    initializePlayer();

    // Cleanup function
    return () => {
      const scriptElement = document.getElementById("scr_673f63f57558ba000b569976");
      if (scriptElement) {
        scriptElement.remove();
      }
      // Remove global error handler
      window.onerror = null;
    };
  }, []); // Empty dependency array to run only once on mount

  return (
    <>
      <section className="relative bg-white pt-20 pb-16 lg:pt-32">
        {/* Login Button */}
        <div className="absolute top-4 right-4 z-20">
          <Link to="/login">
            <Button 
              variant="ghost" 
              size="sm"
              className="text-gray-700 hover:bg-gray-100 text-sm font-medium px-4"
            >
              Login
            </Button>
          </Link>
        </div>

        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Column - Text Content */}
            <div className="text-left">
              <img
                src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
                alt="GetBrands Logo"
                className="h-12 mb-8"
              />
              
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Create your own private label on demand
              </h1>
              
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                We specialize in cosmetics, supplements, and coffee. From idea to launch, 
                we build your brand from the ground up.
              </p>

              <Link to="/login">
                <Button 
                  size="lg"
                  className="bg-[#f0562e] hover:bg-[#f0562e]/90 text-white font-semibold px-8"
                >
                  Start Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            </div>

            {/* Right Column - Video */}
            <div className="max-w-2xl mx-auto lg:mx-0">
              {!scriptError ? (
                <div id="vid_673f63f57558ba000b569976" style={{ position: 'relative', width: '100%', padding: '56.25% 0 0' }}>
                  <img 
                    id="thumb_673f63f57558ba000b569976" 
                    src="https://images.converteai.net/5719503f-d81c-468d-9d79-d4381d85c6da/players/673f63f57558ba000b569976/thumbnail.jpg" 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    alt="Video thumbnail"
                  />
                  <div 
                    id="backdrop_673f63f57558ba000b569976" 
                    style={{ 
                      WebkitBackdropFilter: 'blur(5px)',
                      backdropFilter: 'blur(5px)',
                      position: 'absolute',
                      top: 0,
                      height: '100%',
                      width: '100%'
                    }}
                  />
                </div>
              ) : (
                <div className="relative w-full pt-[56.25%] bg-gray-100 rounded-lg">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <p className="text-gray-500">Video player unavailable</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};