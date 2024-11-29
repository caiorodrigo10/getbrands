import { Routes, Route, Navigate } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { AdminRoutes } from "./AdminRoutes";
import { marketingRoutes } from "./MarketingRoutes";
import { ProtectedRoute } from "./ProtectedRoute";
import { LanguageRoute } from "@/components/routing/LanguageRoute";
import Dashboard from "@/pages/Dashboard";
import Projects from "@/pages/Projects";
import Products from "@/pages/Products";
import Catalog from "@/pages/Catalog";
import ProfitCalculator from "@/pages/ProfitCalculator";
import SampleOrders from "@/pages/SampleOrders";
import StartHere from "@/pages/StartHere";
import Profile from "@/pages/Profile";
import { useTranslation } from "react-i18next";

// Define your AppRoutes
export const AppRoutes = () => {
  const { i18n } = useTranslation();
  
  return (
    <Routes>
      <Route element={<LanguageRoute />}>
        <Route path="/" element={<Navigate to="/en" replace />} />
        <Route path="/:lang" element={<>{marketingRoutes}</>} />
        
        <Route
          path="/:lang/admin/*"
          element={
            <ProtectedRoute requiresAdmin>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        <Route path="/:lang" element={<AppLayout />}>
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
          <Route path="*" element={<Navigate to={`/${i18n.language}/`} replace />} />
        </Route>
      </Route>
    </Routes>
  );
};