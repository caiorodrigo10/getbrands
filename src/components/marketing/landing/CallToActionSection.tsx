import { Button } from "@/components/ui/button";

export const CallToActionSection = () => {
  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
          Ready to Start Your Brand Journey?
        </h2>
        <p className="text-lg mb-8 text-white/90">
          Join thousands of successful entrepreneurs who have built their brands with us.
        </p>
        <Button 
          size="lg" 
          variant="outline"
          className="text-white border-white hover:bg-white hover:text-primary"
        >
          Start Building Your Brand
        </Button>
      </div>
    </section>
  );
};