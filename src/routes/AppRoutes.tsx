import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { AdminRoutes } from "./AdminRoutes";
import { marketingRoutes } from "./MarketingRoutes";
import { ProtectedRoute } from "./ProtectedRoute";
import { LanguageRoute } from "@/components/routing/LanguageRoute";
import { useTranslation } from "react-i18next";

// Lazy load pages for better performance
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Products from "@/pages/Products";
import Catalog from "@/pages/Catalog";
import ProfitCalculator from "@/pages/ProfitCalculator";
import SampleOrders from "@/pages/SampleOrders";
import StartHere from "@/pages/StartHere";
import Profile from "@/pages/Profile";

export const AppRoutes = () => {
  const { i18n } = useTranslation();
  
  return (
    <Routes>
      <Route element={<LanguageRoute />}>
        <Route path="/" element={<Navigate to={`/${i18n.language}`} replace />} />
        
        <Route path="/:lang">
          {/* Marketing Routes */}
          {marketingRoutes}
          
          {/* Admin Routes */}
          <Route
            path="admin/*"
            element={
              <ProtectedRoute requiresAdmin>
                <AdminRoutes />
              </ProtectedRoute>
            }
          />

          {/* App Routes */}
          <Route element={<AppLayout />}>
            <Route
              path="dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route path="projects" element={<Projects />} />
            <Route path="products" element={<Products />} />
            <Route path="catalog" element={<Catalog />} />
            <Route path="profit-calculator" element={<ProfitCalculator />} />
            <Route path="sample-orders" element={<SampleOrders />} />
            <Route path="start-here" element={<StartHere />} />
            <Route path="profile" element={<Profile />} />
          </Route>

          {/* Fallback route */}
          <Route path="*" element={<Navigate to={`/${i18n.language}`} replace />} />
        </Route>
      </Route>
    </Routes>
  );
};