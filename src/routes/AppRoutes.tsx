import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect } from 'react';
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "./AppLayout";
import { MarketingRoutes } from "./MarketingRoutes";
import { AdminRoutes } from "./AdminRoutes";
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
import { useTranslation } from "react-i18next";
import { useAuth } from "@/contexts/AuthContext";
import LandingPage from "@/pages/marketing/LandingPage";

// Language redirect component with updated logic
const LanguageRedirect = () => {
  const { i18n } = useTranslation();
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  
  // Get browser language or default to 'en'
  const getBrowserLanguage = () => {
    const browserLang = navigator.language.split('-')[0];
    return ['en', 'pt', 'es'].includes(browserLang) ? browserLang : 'en';
  };

  // If at root, handle redirection based on auth status
  if (location.pathname === '/') {
    const targetLang = i18n.language || getBrowserLanguage();
    
    // For authenticated users, redirect to their dashboard
    if (isAuthenticated) {
      return <Navigate to={`/${targetLang}/dashboard`} replace />;
    }
    
    // For unauthenticated users, redirect to public homepage
    return <Navigate to={`/${targetLang}`} replace />;
  }

  // Handle direct login route access
  if (location.pathname === '/login') {
    const targetLang = i18n.language || getBrowserLanguage();
    return <Navigate to={`/${targetLang}/login`} replace />;
  }

  // Check if current path needs language prefix
  const firstSegment = location.pathname.split('/')[1];
  const supportedLanguages = ['en', 'pt', 'es'];
  
  if (!supportedLanguages.includes(firstSegment) && location.pathname !== '/') {
    const targetLang = i18n.language || getBrowserLanguage();
    return <Navigate to={`/${targetLang}${location.pathname}`} replace />;
  }

  return null;
};

export const AppRoutes = () => {
  const location = useLocation();
  const { i18n } = useTranslation();
  
  useEffect(() => {
    console.log('[DEBUG] AppRoutes - Current location:', location.pathname);
  }, [location]);

  // Create routes for each supported language
  const createLocalizedRoutes = (language: string) => (
    <Route path={`/${language}`} element={<AppLayout />}>
      {/* Public index route - no authentication required */}
      <Route index element={<LandingPage />} />
      <MarketingRoutes />
      
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
      
      <Route path="*" element={<Error404 />} />
    </Route>
  );

  return (
    <Routes>
      {/* Language redirect handler */}
      <Route path="/" element={<LanguageRedirect />} />
      <Route path="/login" element={<LanguageRedirect />} />
      
      {/* Create routes for each supported language */}
      {createLocalizedRoutes('en')}
      {createLocalizedRoutes('pt')}
      {createLocalizedRoutes('es')}

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

      {/* Success page as a standalone route */}
      <Route path="/checkout/success" element={
        <ProtectedRoute>
          <Success />
        </ProtectedRoute>
      } />
    </Routes>
  );
};
