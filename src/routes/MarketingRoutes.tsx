import { Route } from "react-router-dom";
import LandingPage from "@/pages/marketing/LandingPage";
import PrivacyPolicy from "@/pages/marketing/PrivacyPolicy";
import TermsAndConditions from "@/pages/marketing/TermsAndConditions";

export const marketingRoutes = [
  <Route key="landing" index element={<LandingPage />} />,
  <Route key="privacy" path="policies" element={<PrivacyPolicy />} />,
  <Route key="terms" path="terms" element={<TermsAndConditions />} />
];