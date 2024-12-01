import { Routes, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "./AppLayout";
import { MarketingRoutes } from "./MarketingRoutes";
import { AdminRoutes } from "./AdminRoutes";
import { CheckoutRoutes } from "./CheckoutRoutes";
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import SignUpPT from "@/pages/pt/SignUp";
import StartHere from "@/pages/StartHere";
import StartHerePT from "@/pages/pt/StartHerePT";
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
import ProfitCalculator from "@/pages/ProfitCalculator";
import Error404 from "@/pages/Error404";
import PackageQuizPage from "@/pages/PackageQuizPage";
import OnboardingQuizPage from "@/pages/OnboardingQuiz";
import { OnboardingQuizPT } from "@/pages/pt/OnboardingQuiz";
import ComecarPT from "@/pages/pt/ComecarPT";

export const AppRoutes = () => {
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

        <Route path="/pt/start-here" element={
          <ProtectedRoute>
            <StartHerePT />
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
      </Route>

      {/* Checkout Routes */}
      {CheckoutRoutes}

      {/* Portuguese Routes */}
      <Route path="/pt/signup" element={<SignUpPT />} />
      <Route path="/pt/onboarding" element={
        <ProtectedRoute>
          <OnboardingQuizPT />
        </ProtectedRoute>
      } />
      <Route path="/comecarpt" element={<ComecarPT />} />

      {/* Marketing Routes */}
      {MarketingRoutes}
      
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/onboarding" element={<OnboardingQuizPage />} />
      
      {/* Admin Routes */}
      <Route path="/admin/*" element={
        <ProtectedRoute requiresAdmin>
          <AdminRoutes />
        </ProtectedRoute>
      } />

      {/* Catch all route */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};