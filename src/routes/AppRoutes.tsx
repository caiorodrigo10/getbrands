import { Routes, Route } from "react-router-dom";
import Login from "@/pages/Login";
import ForgotPassword from "@/pages/ForgotPassword";
import Dashboard from "@/pages/Dashboard";
import Catalog from "@/pages/Catalog";
import Profile from "@/pages/Profile";
import Error404 from "@/pages/Error404";
import PrivateRoute from "@/components/auth/PrivateRoute";
import PublicRoute from "@/components/auth/PublicRoute";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicRoute />}>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Route>

      {/* Protected Routes */}
      <Route element={<PrivateRoute />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/profile" element={<Profile />} />
      </Route>

      {/* 404 Route */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};

export default AppRoutes;