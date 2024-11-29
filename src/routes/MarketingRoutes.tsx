import { Route } from "react-router-dom";
import { LandingPage } from "@/pages/marketing/LandingPage";
import { PrivacyPolicy } from "@/pages/marketing/PrivacyPolicy";
import { TermsAndConditions } from "@/pages/marketing/TermsAndConditions";

export const MarketingRoutes = (
  <>
    <Route path="/landing" element={<LandingPage />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
  </>
);