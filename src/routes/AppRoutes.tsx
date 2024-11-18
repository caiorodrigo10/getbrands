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
import { AdminLayout } from "@/components/admin/AdminLayout";

export const AppRoutes = () => (
  <Routes>
    {/* Marketing Routes */}
    {MarketingRoutes}
    
    {/* Public Routes */}
    <Route path="/login" element={<Login />} />
    
    {/* Admin Routes - Wrapped in AdminLayout */}
    <Route element={<AdminLayout>
      <Routes>
        {AdminRoutes}
      </Routes>
    </AdminLayout>} />
    
    {/* Client Routes - Wrapped in AppLayout */}
    <Route element={<AppLayout>
      <Routes>
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

        <Route path="/package-quiz/:projectId" element={
          <ProtectedRoute>
            <PackageQuizPage />
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
        
        <Route path="/products/:id" element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        } />
        
        <Route path="/products/success" element={
          <ProtectedRoute>
            <ProductSelectedSuccess />
          </ProtectedRoute>
        } />
        
        <Route path="/documents" element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        } />
        
        <Route path="/sample-orders" element={
          <ProtectedRoute>
            <SampleOrders />
          </ProtectedRoute>
        } />
        
        <Route path="/profit-calculator" element={
          <ProtectedRoute>
            <ProfitCalculator />
          </ProtectedRoute>
        } />

        <Route path="*" element={<Error404 />} />
      </Routes>
    </AppLayout>} />

    {/* Standalone Routes */}
    <Route path="/checkout/*" element={
      <ProtectedRoute>
        <Checkout />
      </ProtectedRoute>
    } />
    
    <Route path="/checkout/success" element={
      <ProtectedRoute>
        <Success />
      </ProtectedRoute>
    } />
  </Routes>
);