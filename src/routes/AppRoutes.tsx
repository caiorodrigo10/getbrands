import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import { AppLayout } from "./AppLayout";
import { MarketingRoutes } from "./MarketingRoutes";
import { AdminRoutes } from "./AdminRoutes";
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
import Checkout from "@/pages/checkout/Checkout";
import Success from "@/pages/checkout/Success";
import Shipping from "@/pages/checkout/Shipping";
import Payment from "@/pages/checkout/Payment";
import ProfitCalculator from "@/pages/ProfitCalculator";
import Error404 from "@/pages/Error404";
import PackageQuizPage from "@/pages/PackageQuizPage";
import OnboardingQuizPage from "@/pages/OnboardingQuiz";
import { OnboardingQuizPT } from "@/pages/pt/OnboardingQuiz";
import ComecarPT from "@/pages/pt/ComecarPT";
import PedidoAmostra from "@/pages/PedidoAmostra";

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

      {/* Checkout Routes - Mantidas fora do AppLayout */}
      <Route path="/checkout" element={
        <ProtectedRoute>
          <Checkout />
        </ProtectedRoute>
      }>
        <Route index element={<Navigate to="confirmation" replace />} />
        <Route path="confirmation" element={<PedidoAmostra />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="payment" element={<Payment />} />
        <Route path="points" element={<PedidoAmostra />} />
      </Route>

      <Route path="/checkout/success" element={
        <ProtectedRoute>
          <Success />
        </ProtectedRoute>
      } />
    </Routes>
  );
};