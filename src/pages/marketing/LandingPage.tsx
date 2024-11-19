import { HeroSection } from "@/components/marketing/landing/HeroSection";
import { ServicesSection } from "@/components/marketing/landing/ServicesSection";
import { WhyChooseSection } from "@/components/marketing/landing/WhyChooseSection";
import { SuccessMetrics } from "@/components/marketing/landing/SuccessMetrics";
import { BrandBuildingSection } from "@/components/marketing/landing/BrandBuildingSection";
import { TestimonialsSection } from "@/components/marketing/landing/TestimonialsSection";
import { ProductCategoriesSection } from "@/components/marketing/landing/ProductCategoriesSection";
import { CreativeSection } from "@/components/marketing/landing/CreativeSection";
import { Footer } from "@/components/marketing/landing/Footer";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <SuccessMetrics />
      <ServicesSection />
      <BrandBuildingSection />
      <CreativeSection />
      <ProductCategoriesSection />
      <WhyChooseSection />
      <TestimonialsSection />
      <Footer />
    </div>
  );
};

export default LandingPage;