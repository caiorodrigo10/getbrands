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

export const AppRoutes = () => (
  <Routes>
    {/* Marketing Routes (Landing Page) - Not Protected */}
    {MarketingRoutes}
    
    {/* Public Routes */}
    <Route path="/login" element={<Login />} />
    
    {/* Protected Routes */}
    <Route element={
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    }>
      {/* Admin Routes */}
      {AdminRoutes}
      
      {/* Client Routes */}
      <Route path="/dashboard" element={<Dashboard />} />
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
      <Route path="/checkout/*" element={<Checkout />} />
      <Route path="/checkout/success" element={<Success />} />
      <Route path="*" element={<Error404 />} />
    </Route>
  </Routes>
);