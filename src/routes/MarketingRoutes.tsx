
import { Route } from "react-router-dom";
import LandingPage from "@/pages/marketing/LandingPage";
import PrivacyPolicy from "@/pages/marketing/PrivacyPolicy";
import TermsAndConditions from "@/pages/marketing/TermsAndConditions";

export const MarketingRoutes = (
  <Route path="/">
    <Route index element={<LandingPage />} />
    <Route path="policies" element={<PrivacyPolicy />} />
    <Route path="terms" element={<TermsAndConditions />} />
  </Route>
);
