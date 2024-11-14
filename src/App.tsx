import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { useAuth } from "./contexts/AuthContext";
import Sidebar from "./components/Sidebar";
import Login from "./pages/Login";
import Index from "./pages/Index";
import Profile from "./pages/Profile";
import Projects from "./pages/Projects";
import Catalog from "./pages/Catalog";
import Products from "./pages/Products";
import ProductSelectedSuccess from "./pages/products/ProductSelectedSuccess";
import Documents from "./pages/Documents";
import SampleOrders from "./pages/SampleOrders";
import Checkout from "./pages/checkout/Checkout";
import Error404 from "./pages/Error404";
import Success from "./pages/checkout/Success";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 60 * 24,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
});

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" />;
  return <>{children}</>;
};

const AppLayout = ({ children }: { children: React.ReactNode }) => (
  <div className="flex min-h-screen bg-background">
    <Sidebar />
    <main className="flex-1 ml-64 p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">{children}</div>
    </main>
  </div>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <TooltipProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Index />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Profile />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/projects"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Projects />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/catalog"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Catalog />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Products />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/products/success"
                element={
                  <ProtectedRoute>
                    <ProductSelectedSuccess />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/documents"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Documents />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/sample-orders"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <SampleOrders />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout/*"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/checkout/success"
                element={
                  <ProtectedRoute>
                    <Success />
                  </ProtectedRoute>
                }
              />
              <Route
                path="*"
                element={
                  <ProtectedRoute>
                    <AppLayout>
                      <Error404 />
                    </AppLayout>
                  </ProtectedRoute>
                }
              />
            </Routes>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;