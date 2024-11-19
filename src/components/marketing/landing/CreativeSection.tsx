import { Button } from "@/components/ui/button";

export const CreativeSection = () => {
  return (
    <section className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            On-brand creative, built end-to-end
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            From brand strategy to product launch, we create your complete brand identity. 
            Schedule a call to start building your brand today.
          </p>
          <Button 
            size="lg"
            className="bg-[#F16529] hover:bg-[#F16529]/90 text-white font-semibold px-8 py-6 text-lg"
          >
            BOOK A CALL
          </Button>
        </div>
      </div>
    </section>
  );
};