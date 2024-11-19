import { Button } from "@/components/ui/button";

export const CreativeSection = () => {
  return (
    <section className="py-32 bg-white">
      <div className="container mx-auto px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          {/* Left side - Text content */}
          <div className="flex-1 max-w-2xl">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Book in minutes - not weeks
            </h2>
            <div className="space-y-6">
              <div>
                <p className="text-xl text-gray-600 mb-2">
                  Share your goals & plan your shoot in just a few steps.
                </p>
                <p className="text-xl text-gray-600">
                  Select & pay for models & upgrades at this time.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                  (non-members pay the Studio pass for $149 per booking)
                </p>
              </div>
              
              <div>
                <p className="text-xl text-gray-400">
                  Join your shoot & approve selects in real-time
                </p>
              </div>
              
              <div>
                <p className="text-xl text-gray-400">
                  Order assets & get edits in 24 hours
                </p>
              </div>
              
              <div>
                <p className="text-xl text-gray-400">
                  Optimize & improve performance
                </p>
              </div>

              <Button 
                size="lg"
                className="bg-[#F16529] hover:bg-[#F16529]/90 text-white font-semibold px-8 py-6 text-lg mt-8"
              >
                BOOK A CALL
              </Button>
            </div>
          </div>

          {/* Right side - Image */}
          <div className="flex-1 relative">
            <img
              src="/lovable-uploads/0de52261-98d4-4cf2-bd99-015a0a38695f.png"
              alt="Booking Process Illustration"
              className="w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};