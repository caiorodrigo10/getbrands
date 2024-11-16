import { HeroSection } from "@/components/marketing/landing/HeroSection";
import { FeaturesSection } from "@/components/marketing/landing/FeaturesSection";
import { ProductCategoriesSection } from "@/components/marketing/landing/ProductCategoriesSection";
import { BrandBuildingSection } from "@/components/marketing/landing/BrandBuildingSection";
import { TestimonialsSection } from "@/components/marketing/landing/TestimonialsSection";
import { ReasonsSection } from "@/components/marketing/landing/ReasonsSection";
import { CallToActionSection } from "@/components/marketing/landing/CallToActionSection";
import { Footer } from "@/components/marketing/landing/Footer";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <FeaturesSection />
      <ProductCategoriesSection />
      <BrandBuildingSection />
      <TestimonialsSection />
      <ReasonsSection />
      <CallToActionSection />
      <Footer />
    </div>
  );
};

export default LandingPage;