import { Routes, Route, Navigate } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "./AppLayout";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import Catalog from "@/pages/Catalog";
import Products from "@/pages/Products";
import ProductDetails from "@/pages/ProductDetails";
import ProductSelectedSuccess from "@/pages/products/ProductSelectedSuccess";
import Documents from "@/pages/Documents";
import SampleOrders from "@/pages/SampleOrders";
import Checkout from "@/pages/checkout/Checkout";
import Success from "@/pages/checkout/Success";
import ProfitCalculator from "@/pages/ProfitCalculator";
import Error404 from "@/pages/Error404";
import PackageQuizPage from "@/pages/PackageQuizPage";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminProjects from "@/pages/admin/AdminProjects";

export const AppRoutes = () => (
  <Routes>
    {/* Public Routes */}
    <Route path="/login" element={<Login />} />
    
    {/* Protected Routes */}
    <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
      <Route path="/" element={<Dashboard />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/projects/:id" element={<ProjectDetails />} />
      <Route path="/package-quiz/:projectId" element={<PackageQuizPage />} />
      <Route path="/catalog" element={<Catalog />} />
      <Route path="/catalog/:id" element={<ProductDetails />} />
      <Route path="/products" element={<Products />} />
      <Route path="/products/:id" element={<ProductDetails />} />
      <Route path="/products/success" element={<ProductSelectedSuccess />} />
      <Route path="/documents" element={<Documents />} />
      <Route path="/sample-orders" element={<SampleOrders />} />
      <Route path="/profit-calculator" element={<ProfitCalculator />} />
    </Route>

    {/* Protected Checkout Routes */}
    <Route element={<ProtectedRoute />}>
      <Route path="/checkout/*" element={<Checkout />} />
      <Route path="/checkout/success" element={<Success />} />
    </Route>

    {/* Protected Admin Routes */}
    <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/admin/projects" element={<AdminProjects />} />
    </Route>

    {/* Catch-all route for 404 */}
    <Route path="*" element={<Error404 />} />
  </Routes>
);