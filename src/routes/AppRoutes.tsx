import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "./AppLayout";
import { MarketingRoutes } from "./MarketingRoutes";
import { AdminRoutes } from "./AdminRoutes";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import SignUpPT from "@/pages/pt/SignUp";
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
import OnboardingQuizPT from "@/pages/pt/OnboardingQuiz";
import MarketingQuizPagePT from "@/pages/pt/MarketingQuizPage";

export const AppRoutes = () => {
  const location = useLocation();
  
  useEffect(() => {
    console.log('[DEBUG] AppRoutes - Current location:', location.pathname);
  }, [location]);

  return (
    <Routes>
      {/* Root Route */}
      <Route element={<AppLayout />}>
        <Route path="/" element={
          <ProtectedRoute>
            <Catalog />
          </ProtectedRoute>
        } />
        
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
        
        {/* Client Routes */}
        <Route path="/start-here" element={
          <ProtectedRoute>
            <StartHere />
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

        {/* Portuguese Routes */}
        <Route path="/pt/signup" element={<SignUpPT />} />
        <Route path="/pt/onboarding" element={
          <ProtectedRoute>
            <OnboardingQuizPT />
          </ProtectedRoute>
        } />
        <Route path="/quizmktpt" element={<MarketingQuizPagePT />} />

        {/* Marketing Routes */}
        {MarketingRoutes}
        
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/onboarding" element={<OnboardingQuizPage />} />
      
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
      }>
        <Route path="shipping" element={<Checkout />} />
        <Route path="payment" element={<Checkout />} />
        <Route path="confirmation" element={<Checkout />} />
        <Route path="points" element={<Checkout />} />
      </Route>

      {/* Success page as a standalone route */}
      <Route path="/checkout/success" element={
        <ProtectedRoute>
          <Success />
        </ProtectedRoute>
      } />
      </Route>
    </Routes>
  );
};
