import { Button } from "@/components/ui/button";

export const HeroSection = () => {
  return (
    <section className="bg-primary relative overflow-hidden py-12">
      <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">
            Your brand. Our expertise.
          </h1>
          <p className="text-lg mb-8 text-white/90">
            Creating a brand that stands out isn't easy. That's where we come in. From supplements to beauty products, we'll help you bring your vision to life. Every step of the way, we'll guide you to success.
          </p>
          <Button 
            size="lg"
            variant="outline"
            className="text-white border-white hover:bg-white hover:text-primary"
          >
            Get Started Now
          </Button>
        </div>
        <div className="flex-1">
          <div className="bg-gray-300 w-full h-[400px] rounded-lg"></div>
        </div>
      </div>
    </section>
  );
};