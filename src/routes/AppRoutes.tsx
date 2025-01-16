import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoutes } from "./AdminRoutes";
import { MarketingRoutes } from "./MarketingRoutes";
import { AppLayout } from "./AppLayout";
import Index from "@/pages/Index";
import ComecarPT from "@/pages/pt/ComecarPT";
import OnboardingQuizPT from "@/pages/pt/OnboardingQuizPT";
import SignUpPT from "@/pages/pt/SignUpPT";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsAndConditions from "@/pages/TermsAndConditions";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import ForgotPassword from "@/pages/ForgotPassword";
import Error404 from "@/pages/Error404";
import Dashboard from "@/pages/Dashboard";
import Catalog from "@/pages/Catalog";
import Profile from "@/pages/Profile";
import Projects from "@/pages/Projects";
import Project from "@/pages/Project";
import SampleOrders from "@/pages/SampleOrders";
import ProfitCalculator from "@/pages/ProfitCalculator";
import StartHere from "@/pages/StartHere";

export const AppRoutes = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Marketing Routes */}
      <Route element={<MarketingRoutes />}>
        <Route path="/" element={<Index />} />
        <Route path="/comecarpt" element={<ComecarPT />} />
        <Route path="/pt/quiz" element={<OnboardingQuizPT />} />
        <Route path="/pt/signup" element={<SignUpPT />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
      </Route>

      {/* Auth Routes */}
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/signup"
        element={!isAuthenticated ? <SignUp /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/forgot-password"
        element={!isAuthenticated ? <ForgotPassword /> : <Navigate to="/dashboard" />}
      />

      {/* Protected Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<Project />} />
          <Route path="/sample-orders" element={<SampleOrders />} />
          <Route path="/profit-calculator" element={<ProfitCalculator />} />
          <Route path="/start-here" element={<StartHere />} />
        </Route>
      </Route>

      {/* Admin Routes */}
      <Route element={<ProtectedRoute requiresAdmin />}>
        <Route path="/admin/*" element={<AdminRoutes />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};