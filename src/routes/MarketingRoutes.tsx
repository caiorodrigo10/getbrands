import { Route } from "react-router-dom";
import LandingPage from "@/pages/marketing/LandingPage";

export const MarketingRoutes = (
  <Route>
    <Route index element={<LandingPage />} />
  </Route>
);