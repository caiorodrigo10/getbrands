import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export const HeroSection = () => {
  useEffect(() => {
    const s = document.createElement("script");
    s.src = "https://scripts.converteai.net/5719503f-d81c-468d-9d79-d4381d85c6da/players/673f63f57558ba000b569976/player.js";
    s.async = true;
    document.head.appendChild(s);

    return () => {
      // Cleanup: remove script on unmount
      const scriptElement = document.querySelector('script[src*="673f63f57558ba000b569976"]');
      if (scriptElement) {
        scriptElement.remove();
      }
    };
  }, []);

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
              <div id="vid_673f63f57558ba000b569976" style={{ position: 'relative', width: '100%', padding: '56.25% 0 0' }}>
                <img 
                  id="thumb_673f63f57558ba000b569976" 
                  src="https://images.converteai.net/5719503f-d81c-468d-9d79-d4381d85c6da/players/673f63f57558ba000b569976/thumbnail.jpg" 
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  alt="thumbnail"
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
              <style>{`
                .elementor-element:has(#smartplayer) {
                  width: 100%;
                }
              `}</style>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};