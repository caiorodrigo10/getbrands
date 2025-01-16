import { Route } from "react-router-dom";
import StartHere from "@/pages/StartHere";
import StartHerePT from "@/pages/pt/StartHerePT";
import Profile from "@/pages/Profile";
import Projects from "@/pages/Projects";
import ProjectDetails from "@/pages/ProjectDetails";
import PackageQuizPage from "@/pages/PackageQuizPage";
import Catalog from "@/pages/Catalog";
import Products from "@/pages/Products";
import ProductDetails from "@/pages/ProductDetails";
import ProductSelectedSuccess from "@/pages/products/ProductSelectedSuccess";
import Documents from "@/pages/Documents";
import SampleOrders from "@/pages/SampleOrders";
import ProfitCalculator from "@/pages/ProfitCalculator";
import DemoScheduling from "@/pages/DemoScheduling";
import Dashboard from "@/pages/Dashboard";
import { ProtectedRoute } from "./ProtectedRoute";

export const ClientRoutes = [
  <Route
    path="/"
    element={
      <ProtectedRoute>
        <Catalog />
      </ProtectedRoute>
    }
    key="root"
  />,
  
  <Route
    path="/dashboard"
    element={
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    }
    key="dashboard"
  />,

  <Route
    path="/start-here"
    element={
      <ProtectedRoute>
        <StartHere />
      </ProtectedRoute>
    }
    key="start-here"
  />,

  <Route
    path="/pt/start-here"
    element={
      <ProtectedRoute>
        <StartHerePT />
      </ProtectedRoute>
    }
    key="start-here-pt"
  />,

  <Route
    path="/profile"
    element={
      <ProtectedRoute>
        <Profile />
      </ProtectedRoute>
    }
    key="profile"
  />,

  <Route
    path="/projects"
    element={
      <ProtectedRoute>
        <Projects />
      </ProtectedRoute>
    }
    key="projects"
  />,

  <Route
    path="/projects/:id"
    element={
      <ProtectedRoute>
        <ProjectDetails />
      </ProtectedRoute>
    }
    key="project-details"
  />,

  <Route
    path="/package-quiz/:projectId"
    element={
      <ProtectedRoute>
        <PackageQuizPage />
      </ProtectedRoute>
    }
    key="package-quiz"
  />,

  <Route
    path="/catalog"
    element={
      <ProtectedRoute>
        <Catalog />
      </ProtectedRoute>
    }
    key="catalog"
  />,

  <Route
    path="/catalog/:id"
    element={
      <ProtectedRoute>
        <ProductDetails />
      </ProtectedRoute>
    }
    key="catalog-product"
  />,

  <Route
    path="/products"
    element={
      <ProtectedRoute>
        <Products />
      </ProtectedRoute>
    }
    key="products"
  />,

  <Route
    path="/products/:id"
    element={
      <ProtectedRoute>
        <ProductDetails />
      </ProtectedRoute>
    }
    key="product-details"
  />,

  <Route
    path="/products/success"
    element={
      <ProtectedRoute>
        <ProductSelectedSuccess />
      </ProtectedRoute>
    }
    key="product-success"
  />,

  <Route
    path="/documents"
    element={
      <ProtectedRoute>
        <Documents />
      </ProtectedRoute>
    }
    key="documents"
  />,

  <Route
    path="/sample-orders"
    element={
      <ProtectedRoute>
        <SampleOrders />
      </ProtectedRoute>
    }
    key="sample-orders"
  />,

  <Route
    path="/profit-calculator"
    element={
      <ProtectedRoute>
        <ProfitCalculator />
      </ProtectedRoute>
    }
    key="profit-calculator"
  />,

  <Route path="/schedule-demo" element={<DemoScheduling />} key="demo-scheduling" />,
];