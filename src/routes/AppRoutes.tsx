import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import ResetPassword from "@/pages/ResetPassword";
import Dashboard from "@/pages/Dashboard";
import Catalog from "@/pages/Catalog";
import Profile from "@/pages/Profile";
import Error404 from "@/pages/Error404";
import PrivateRoute from "@/components/auth/PrivateRoute";
import PublicRoute from "@/components/auth/PublicRoute";
import { AppLayout } from "./AppLayout";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Route>

      {/* Rotas Protegidas */}
      <Route element={<PrivateRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>

      {/* Rota 404 */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default AppRoutes;