import { Route } from "react-router-dom";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import OnboardingQuizPage from "@/pages/OnboardingQuiz";
import ForgotPassword from "@/pages/ForgotPassword";
import Error404 from "@/pages/Error404";

export const PublicRoutes = [
  <Route path="/login" element={<Login />} key="login" />,
  <Route path="/signup" element={<SignUp />} key="signup" />,
  <Route path="/forgot-password" element={<ForgotPassword />} key="forgot-password" />,
  <Route path="/onboarding" element={<OnboardingQuizPage />} key="onboarding" />,
  <Route path="*" element={<Error404 />} key="404" />,
];