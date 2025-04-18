import { Button } from "@/components/ui/button";

export const BrandBuildingSection = () => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1">
            <img 
              src="/lovable-uploads/c3c2f4ff-e9ee-44ef-a00c-93f8e6913fcf.png"
              alt="Brand Building Professional"
              className="rounded-lg shadow-xl"
            />
          </div>
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-6 text-gray-900">
              Brand-building made easy
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              From logo design to product packaging, we'll help you create a brand that stands out. Our team of experts will guide you through every step of the process.
            </p>
            <Button 
              size="lg"
              className="bg-primary text-white hover:bg-primary/90"
            >
              Start Your Brand Now
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};