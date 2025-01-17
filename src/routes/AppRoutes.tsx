import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import Catalog from "@/pages/Catalog";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import PrivateRoute from "@/components/auth/PrivateRoute";
import PublicRoute from "@/components/auth/PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>
      
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;