import { HeroSection } from "@/components/marketing/landing/HeroSection";
import { ServicesSection } from "@/components/marketing/landing/ServicesSection";
import { WhyChooseSection } from "@/components/marketing/landing/WhyChooseSection";
import { SuccessMetrics } from "@/components/marketing/landing/SuccessMetrics";
import { Footer } from "@/components/marketing/landing/Footer";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection />
      <ServicesSection />
      <WhyChooseSection />
      <SuccessMetrics />
      <Footer />
    </div>
  );
};

export default LandingPage;