import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "./AppLayout";
import { MarketingRoutes } from "./MarketingRoutes";
import { AdminRoutes } from "./AdminRoutes";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard";
import Profile from "@/pages/Profile";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import ProjectDetailsV2 from "@/pages/ProjectDetailsV2";
import Catalog from "@/pages/Catalog";
import Products from "@/pages/Products";
import ProductDetails from "@/pages/ProductDetails";
import PedidoAmostra from "@/pages/PedidoAmostra";
import ProductSelectedSuccess from "@/pages/products/ProductSelectedSuccess";

export const AppRoutes = () => (
  <Routes>
    {/* Marketing Routes */}
    {MarketingRoutes}
    
    {/* Public Routes */}
    <Route path="/login" element={<Login />} />
    
    {/* Admin Routes */}
    <Route path="/admin/*" element={<AdminRoutes />} />
    
    {/* Client Routes - Wrapped in AppLayout */}
    <Route element={<AppLayout />}>
      <Route path="/" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      } />
      
      <Route path="/profile" element={
        <ProtectedRoute>
          <Profile />
        </ProtectedRoute>
      } />
      
      <Route path="/projects" element={
        <ProtectedRoute>
          <Projects />
        </ProtectedRoute>
      } />
      
      <Route path="/projects/:id" element={
        <ProtectedRoute>
          <ProjectDetails />
        </ProtectedRoute>
      } />

      <Route path="/projects/v2/:id" element={
        <ProtectedRoute>
          <ProjectDetailsV2 />
        </ProtectedRoute>
      } />

      <Route path="/catalog" element={
        <ProtectedRoute>
          <Catalog />
        </ProtectedRoute>
      } />

      <Route path="/catalog/:id" element={
        <ProtectedRoute>
          <ProductDetails />
        </ProtectedRoute>
      } />

      <Route path="/products" element={
        <ProtectedRoute>
          <Products />
        </ProtectedRoute>
      } />

      <Route path="/products/success" element={
        <ProtectedRoute>
          <ProductSelectedSuccess />
        </ProtectedRoute>
      } />

      <Route path="/sample-orders" element={
        <ProtectedRoute>
          <PedidoAmostra />
        </ProtectedRoute>
      } />
    </Route>
  </Routes>
);