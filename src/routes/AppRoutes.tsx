import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { useAuth } from "@/contexts/AuthContext";
import AppLayout from "./AppLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { AdminDashboard } from "@/pages/admin/AdminDashboard";
import { UsersManagement } from "@/pages/admin/UsersManagement";
import { ProjectsManagement } from "@/pages/admin/ProjectsManagement";
import Login from "@/pages/Login";
import Home from "@/pages/Home";
import Profile from "@/pages/Profile";
import SampleRequest from "@/pages/SampleRequest";
import SampleOrders from "@/pages/SampleOrders";
import Projects from "@/pages/Projects";
import Project from "@/pages/Project";
import ProjectQuiz from "@/pages/ProjectQuiz";

export const AppRoutes = () => {
  const { user, isAuthenticated } = useAuth();
  const isAdmin = user?.role === 'admin';

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? "/admin" : "/"} replace />
          ) : (
            <Login />
          )
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UsersManagement />} />
        <Route path="projects" element={<ProjectsManagement />} />
      </Route>

      {/* Regular User Routes */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="profile" element={<Profile />} />
        <Route path="sample-request" element={<SampleRequest />} />
        <Route path="sample-orders" element={<SampleOrders />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<Project />} />
        <Route path="projects/:id/quiz" element={<ProjectQuiz />} />
      </Route>
    </Routes>
  );
};
