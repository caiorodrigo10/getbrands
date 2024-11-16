import { Route } from "react-router-dom";
import MarketingQuizPage from "@/pages/MarketingQuizPage";

export const MarketingRoutes = [
  <Route key="marketing-quiz" path="/start-your-brand" element={<MarketingQuizPage />} />,
];