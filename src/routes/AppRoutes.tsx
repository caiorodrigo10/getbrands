import { Routes, Route } from "react-router-dom";
import { AppLayout } from "./AppLayout";
import { ProtectedRoute } from "./ProtectedRoute";
import { LanguageRoute } from "@/components/routing/LanguageRoute";
import { AdminRoutes } from "./AdminRoutes";
import { marketingRoutes } from "./MarketingRoutes";

// Pages
import Login from "@/pages/Login";
import SignUp from "@/pages/SignUp";
import Dashboard from "@/pages/Dashboard";
import Catalog from "@/pages/Catalog";
import Products from "@/pages/Products";
import ProductDetails from "@/pages/ProductDetails";
import Profile from "@/pages/Profile";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import Documents from "@/pages/Documents";
import OnboardingQuiz from "@/pages/OnboardingQuiz";
import SampleOrders from "@/pages/SampleOrders";
import StartHere from "@/pages/StartHere";
import Error404 from "@/pages/Error404";
import Index from "@/pages/Index";

// Checkout pages
import CartReview from "@/pages/checkout/CartReview";
import Shipping from "@/pages/checkout/Shipping";
import Payment from "@/pages/checkout/Payment";
import Success from "@/pages/checkout/Success";

export const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<LanguageRoute />} />
      
      {/* Marketing Routes */}
      {marketingRoutes}

      {/* Auth Routes */}
      <Route path="/:lang/login" element={<Login />} />
      <Route path="/:lang/signup" element={<SignUp />} />

      {/* Protected Routes */}
      <Route
        path="/:lang"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="catalog" element={<Catalog />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="profile" element={<Profile />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="documents" element={<Documents />} />
        <Route path="onboarding" element={<OnboardingQuiz />} />
        <Route path="sample-orders" element={<SampleOrders />} />
        <Route path="start-here" element={<StartHere />} />
        
        {/* Checkout Routes */}
        <Route path="cart" element={<CartReview />} />
        <Route path="shipping" element={<Shipping />} />
        <Route path="payment" element={<Payment />} />
        <Route path="success" element={<Success />} />
      </Route>

      {/* Admin Routes */}
      <Route
        path="/:lang/admin/*"
        element={
          <ProtectedRoute requiresAdmin>
            <AdminRoutes />
          </ProtectedRoute>
        }
      />

      {/* 404 Route */}
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
};