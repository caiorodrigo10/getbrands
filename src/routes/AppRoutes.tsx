import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import Index from "@/pages/Index";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};
