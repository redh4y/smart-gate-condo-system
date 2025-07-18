import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { Layout } from "./components/Layout";

// Pages
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Pessoas } from "./pages/admin/Pessoas";
import { Casas } from "./pages/admin/Casas";
import { RegistrarAcesso } from "./pages/acessos/RegistrarAcesso";
import { HistoricoAcessos } from "./pages/acessos/HistoricoAcessos";
import { Encomendas } from "./pages/Encomendas";
import { Avisos } from "./pages/Avisos";
import { Ocorrencias } from "./pages/Ocorrencias";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected Routes */}
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              
              {/* Porteiro and Admin Routes */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/acessos/registrar" element={
                <ProtectedRoute>
                  <RegistrarAcesso />
                </ProtectedRoute>
              } />
              
              <Route path="/acessos/historico" element={
                <ProtectedRoute>
                  <HistoricoAcessos />
                </ProtectedRoute>
              } />
              
              <Route path="/encomendas" element={
                <ProtectedRoute>
                  <Encomendas />
                </ProtectedRoute>
              } />
              
              <Route path="/avisos" element={
                <ProtectedRoute>
                  <Avisos />
                </ProtectedRoute>
              } />
              
              {/* Admin Only Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/pessoas" element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                  <Pessoas />
                </ProtectedRoute>
              } />
              
              <Route path="/admin/casas" element={
                <ProtectedRoute allowedRoles={['Administrador']}>
                  <Casas />
                </ProtectedRoute>
              } />
              
              <Route path="/ocorrencias" element={
                <ProtectedRoute>
                  <Ocorrencias />
                </ProtectedRoute>
              } />
            </Route>
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
