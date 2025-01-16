import { Routes, Route, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "./AppLayout";
import { MarketingRoutes } from "./MarketingRoutes";
import AdminRoutes from "./AdminRoutes";
import { ClientRoutes } from "./ClientRoutes";
import { CheckoutRoutes } from "./CheckoutRoutes";
import { PortugueseRoutes } from "./PortugueseRoutes";
import { PublicRoutes } from "./PublicRoutes";

export const AppRoutes = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('[DEBUG] AppRoutes - Current location:', location.pathname);
  }, [location]);

  return (
    <Routes>
      {/* Root Route with AppLayout */}
      <Route element={<AppLayout />}>
        {/* Client Routes */}
        {ClientRoutes}
        
        {/* Portuguese Routes */}
        {PortugueseRoutes}
        
        {/* Marketing Routes */}
        {MarketingRoutes}
        
        {/* Public Routes */}
        {PublicRoutes}
        
        {/* Admin Routes */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        {/* Checkout Routes */}
        {CheckoutRoutes}
      </Route>
    </Routes>
  );
};