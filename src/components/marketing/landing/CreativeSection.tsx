
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Instagram, ShoppingBag, ArrowRight, Play } from "lucide-react";
import { useEffect, useState } from "react";

export const CreativeSection = () => {
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://scripts.converteai.net/lib/js/smartplayer/v1/sdk.min.js";
    script.setAttribute("data-id", "673f63f57558ba000b569976");
    script.async = true;
    document.head.appendChild(script);
    
    script.onload = () => setVideoLoaded(true);

    return () => {
      script.remove();
    };
  }, []);

  return (
    <>
      <section className="py-32 bg-[#fef5fe]">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 leading-tight">
              Build Your Brand <span className="text-[#f0562e]">End-to-End</span> Without the Hassle
            </h2>
            
            {/* Video Player with loading state */}
            <div className="mb-10 relative rounded-xl overflow-hidden shadow-xl">
              {!videoLoaded && (
                <div className="aspect-video bg-gray-100 flex items-center justify-center">
                  <div className="flex flex-col items-center">
                    <div className="w-16 h-16 bg-[#f0562e]/90 rounded-full flex items-center justify-center animate-pulse">
                      <Play className="h-8 w-8 text-white" />
                    </div>
                    <p className="mt-4 text-gray-500">Loading video...</p>
                  </div>
                </div>
              )}
              <div id="ifr_673f63f57558ba000b569976_wrapper" style={{ margin: '0 auto', width: '100%' }}>
                <div style={{ padding: '56.25% 0 0 0', position: 'relative' }} id="ifr_673f63f57558ba000b569976_aspect">
                  <iframe 
                    frameBorder="0" 
                    allowFullScreen 
                    src="https://scripts.converteai.net/5719503f-d81c-468d-9d79-d4381d85c6da/players/673f63f57558ba000b569976/embed.html" 
                    id="ifr_673f63f57558ba000b569976" 
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

            <p className="text-lg text-gray-600 mb-10 leading-relaxed">
              Focus on growing your business while we handle product development, branding, and logistics.
              Schedule a call today to start building your premium brand.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/login">
                <Button 
                  size="lg"
                  className="bg-[#f0562e] hover:bg-[#f0562e]/90 text-white font-semibold px-8 w-full sm:w-auto"
                >
                  Start Your Brand
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              
              <Button 
                size="lg"
                variant="outline"
                className="border-2 border-[#f0562e] text-[#f0562e] hover:bg-[#f0562e]/10 font-semibold px-8 w-full sm:w-auto"
              >
                Schedule Demo
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-[#f0562e] font-medium">THE PROCESS</span>
            <h2 className="text-4xl font-bold mt-2 mb-6">Three Simple Steps to Launch</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our streamlined process makes it easy to transform your ideas into a successful brand.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f0562e] text-white text-2xl font-semibold mb-6">
                1
              </div>
              {/* Line connector (visible on desktop) */}
              <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gray-200"></div>
              <h3 className="text-2xl font-bold mb-4">Select Products</h3>
              <p className="text-gray-600">
                Browse our catalog of premium-quality products that match your brand vision and target market.
              </p>
            </div>

            <div className="text-center relative">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f0562e] text-white text-2xl font-semibold mb-6">
                2
              </div>
              {/* Line connector (visible on desktop) */}
              <div className="hidden md:block absolute top-8 left-[calc(50%+2rem)] w-[calc(100%-4rem)] h-0.5 bg-gray-200"></div>
              <h3 className="text-2xl font-bold mb-4">Create Your Brand</h3>
              <p className="text-gray-600">
                Our design team develops your unique brand identity and custom packaging that stands out.
              </p>
            </div>

            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#f0562e] text-white text-2xl font-semibold mb-6">
                3
              </div>
              <h3 className="text-2xl font-bold mb-4">Launch & Scale</h3>
              <p className="text-gray-600">
                We handle production, fulfillment, and shipping while you focus on marketing and sales.
              </p>
            </div>
          </div>
          
          <div className="mt-16 text-center">
            <Button 
              asChild
              className="bg-[#f0562e] hover:bg-[#f0562e]/90 text-white px-8"
            >
              <Link to="/catalog">
                View Our Product Catalog
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#F2FCE2]">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="w-full aspect-square relative order-last md:order-first">
              <div className="w-full aspect-square relative">
                <div className="absolute inset-0" style={{
                  clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                  overflow: "hidden",
                  background: "white",
                  boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
                  border: "4px solid #F16529"
                }}>
                  <iframe 
                    src="https://streamable.com/e/p4l1fu?quality=highest&autoplay=1&controls=0" 
                    frameBorder="0" 
                    width="100%" 
                    height="100%" 
                    allowFullScreen 
                    style={{
                      width: "100%",
                      height: "100%",
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%) scale(1.2)",
                      pointerEvents: "none"
                    }}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <span className="text-[#f0562e] font-medium">WORRY-FREE FULFILLMENT</span>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                Focus on Sales, We Handle the Rest
              </h2>
              
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <span className="text-xl font-semibold">Sell on</span>
                  <div className="flex items-center gap-4">
                    <ShoppingBag className="w-8 h-8 text-[#96BF48]" />
                    <Instagram className="w-8 h-8 text-[#E4405F]" />
                  </div>
                </div>
              </div>

              <p className="text-xl text-gray-600">
                GetBrands handles product manufacturing, quality control, packaging, and shipping. No upfront inventory costs.
              </p>

              <div>
                <h3 className="text-xl font-semibold mb-4 inline-block border-b-2 border-gray-900">
                  How Our Fulfillment Works
                </h3>
              </div>

              <div className="space-y-4">
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#4ADE80] bg-opacity-20 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 text-[#4ADE80]">
                        🔔
                      </div>
                    </div>
                    <p className="text-lg font-medium">
                      WE RECEIVE YOUR STORE ORDERS
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F59E0B] bg-opacity-20 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 text-[#F59E0B]">
                        📦
                      </div>
                    </div>
                    <p className="text-lg font-medium">
                      WE PACKAGE & SHIP YOUR PRODUCTS
                    </p>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl p-6 shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#3B82F6] bg-opacity-20 rounded-full flex items-center justify-center">
                      <div className="w-6 h-6 text-[#3B82F6]">
                        💰
                      </div>
                    </div>
                    <p className="text-lg font-medium">
                      YOU KEEP THE PROFIT MARGIN
                    </p>
                  </div>
                </div>
              </div>
              
              <Button 
                asChild
                className="bg-[#f0562e] hover:bg-[#f0562e]/90 text-white mt-4"
              >
                <Link to="/signup">
                  Get Started Now
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};
