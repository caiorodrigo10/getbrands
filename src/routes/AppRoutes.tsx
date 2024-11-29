import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { AdminRoutes } from "./AdminRoutes";
import { ProtectedRoute } from "./ProtectedRoute";
import { useTranslation } from "react-i18next";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Products from "@/pages/Products";
import Catalog from "@/pages/Catalog";
import ProfitCalculator from "@/pages/ProfitCalculator";
import SampleOrders from "@/pages/SampleOrders";
import StartHere from "@/pages/StartHere";
import Profile from "@/pages/Profile";
import LandingPage from "@/pages/marketing/LandingPage";
import PrivacyPolicy from "@/pages/marketing/PrivacyPolicy";
import TermsAndConditions from "@/pages/marketing/TermsAndConditions";

export const AppRoutes = () => {
  const { i18n } = useTranslation();
  
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to={`/${i18n.language}`} replace />} />
      
      {/* Language-specific routes */}
      <Route path="/:lang">
        {/* Public routes */}
        <Route index element={<LandingPage />} />
        <Route path="login" element={<Login />} />
        <Route path="policies" element={<PrivacyPolicy />} />
        <Route path="terms" element={<TermsAndConditions />} />

        {/* Protected admin routes */}
        <Route
          path="admin/*"
          element={
            <ProtectedRoute requiresAdmin>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        {/* Protected app routes */}
        <Route
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />
          <Route path="products" element={<Products />} />
          <Route path="catalog" element={<Catalog />} />
          <Route path="profit-calculator" element={<ProfitCalculator />} />
          <Route path="sample-orders" element={<SampleOrders />} />
          <Route path="start-here" element={<StartHere />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to={`/${i18n.language}`} replace />} />
    </Routes>
  );
};