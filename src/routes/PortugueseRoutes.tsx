import { Route } from "react-router-dom";
import SignUpPT from "@/pages/pt/SignUp";
import { OnboardingQuizPT } from "@/pages/pt/OnboardingQuiz";
import ComecarPT from "@/pages/pt/ComecarPT";
import { ProtectedRoute } from "./ProtectedRoute";

export const PortugueseRoutes = [
  <Route path="/pt/signup" element={<SignUpPT />} key="signup-pt" />,
  <Route
    path="/pt/onboarding"
    element={
      <ProtectedRoute>
        <OnboardingQuizPT />
      </ProtectedRoute>
    }
    key="onboarding-pt"
  />,
  <Route path="/comecarpt" element={<ComecarPT />} key="comecar-pt" />,
];