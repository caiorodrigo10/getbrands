import { Route } from "react-router-dom";
import { LandingPage } from "@/pages/marketing/LandingPage";
import { PrivacyPolicy } from "@/pages/marketing/PrivacyPolicy";
import { TermsAndConditions } from "@/pages/marketing/TermsAndConditions";
import { QuizMktPT } from "@/pages/marketing/QuizMktPT";
import { MarketingLayout } from "./MarketingLayout";

export const MarketingRoutes = (
  <>
    <Route path="/" element={<LandingPage />} />
    <Route path="/privacy-policy" element={<PrivacyPolicy />} />
    <Route path="/terms" element={<TermsAndConditions />} />
    <Route element={<MarketingLayout />}>
      <Route path="/quizmktpt" element={<QuizMktPT />} />
    </Route>
  </>
);