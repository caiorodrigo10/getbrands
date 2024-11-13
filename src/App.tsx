import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Index from "./pages/Index";
import Perfil from "./pages/Perfil";
import Projetos from "./pages/Projetos";
import Catalogo from "./pages/Catalogo";
import Produtos from "./pages/Produtos";
import Documentos from "./pages/Documentos";
import PedidoAmostra from "./pages/PedidoAmostra";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <TooltipProvider>
          <div className="flex">
            <Sidebar />
            <main className="ml-48 flex-1 bg-gray-950 min-h-screen">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/perfil" element={<Perfil />} />
                <Route path="/projetos" element={<Projetos />} />
                <Route path="/catalogo" element={<Catalogo />} />
                <Route path="/produtos" element={<Produtos />} />
                <Route path="/documentos" element={<Documentos />} />
                <Route path="/pedido-amostra" element={<PedidoAmostra />} />
              </Routes>
            </main>
          </div>
          <Toaster />
          <Sonner />
        </TooltipProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;