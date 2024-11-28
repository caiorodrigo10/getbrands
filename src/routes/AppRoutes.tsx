import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { LanguageRoute } from "@/components/routing/LanguageRoute";
import { ProtectedRoute } from "./ProtectedRoute";
import { AdminRoutes } from "./AdminRoutes";
import { marketingRoutes } from "./MarketingRoutes";

// Page imports
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import StartHere from "@/pages/StartHere";
import Profile from "@/pages/Profile";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import Catalog from "@/pages/Catalog";
import Dashboard from "@/pages/Dashboard";
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
import OnboardingQuizPage from "@/pages/OnboardingQuiz";

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Language redirect handler */}
      <Route path="*" element={<LanguageRoute />} />
      
      {/* Dynamic language routes */}
      <Route path="/:lang" element={<AppLayout />}>
        {/* Marketing routes */}
        {marketingRoutes}
        
        {/* Protected routes */}
        <Route path="dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        <Route path="start-here" element={
          <ProtectedRoute>
            <StartHere />
          </ProtectedRoute>
        } />
        
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
        
        <Route path="projects" element={
          <ProtectedRoute>
            <Projects />
          </ProtectedRoute>
        } />
        
        <Route path="projects/:id" element={
          <ProtectedRoute>
            <ProjectDetails />
          </ProtectedRoute>
        } />
        
        <Route path="package-quiz/:projectId" element={
          <ProtectedRoute>
            <PackageQuizPage />
          </ProtectedRoute>
        } />
        
        <Route path="catalog" element={
          <ProtectedRoute>
            <Catalog />
          </ProtectedRoute>
        } />
        
        <Route path="catalog/:id" element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        } />
        
        <Route path="products" element={
          <ProtectedRoute>
            <Products />
          </ProtectedRoute>
        } />
        
        <Route path="products/:id" element={
          <ProtectedRoute>
            <ProductDetails />
          </ProtectedRoute>
        } />
        
        <Route path="products/success" element={
          <ProtectedRoute>
            <ProductSelectedSuccess />
          </ProtectedRoute>
        } />
        
        <Route path="documents" element={
          <ProtectedRoute>
            <Documents />
          </ProtectedRoute>
        } />
        
        <Route path="sample-orders" element={
          <ProtectedRoute>
            <SampleOrders />
          </ProtectedRoute>
        } />
        
        <Route path="profit-calculator" element={
          <ProtectedRoute>
            <ProfitCalculator />
          </ProtectedRoute>
        } />
      </Route>

      {/* Public Routes with language support */}
      <Route path="/:lang/login" element={<Login />} />
      <Route path="/:lang/signup" element={<SignUp />} />
      <Route path="/:lang/onboarding" element={<OnboardingQuizPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute requiresAdmin>
          <AdminRoutes />
        </ProtectedRoute>
      } />

      {/* Standalone Checkout Routes */}
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

      {/* Catch-all route */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};